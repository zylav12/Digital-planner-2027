import os
import tempfile
import unittest
from datetime import date

from pypdf import PdfReader

import build_planner


class PlannerPdfNavigationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        cls.pdf_path = os.path.join(cls.temp_dir.name, "planner-test.pdf")
        old_output = build_planner.OUTPUT
        build_planner.OUTPUT = cls.pdf_path
        try:
            build_planner.build()
        finally:
            build_planner.OUTPUT = old_output
        cls.reader = PdfReader(cls.pdf_path)

    @classmethod
    def tearDownClass(cls):
        cls.temp_dir.cleanup()

    def test_week_coverage_includes_every_overlapping_week(self):
        starts = list(build_planner.week_starts(2027))
        self.assertEqual(len(starts), 53)
        self.assertEqual(starts[0], date(2026, 12, 28))
        self.assertEqual(starts[-1], date(2027, 12, 27))
        for start in starts:
            self.assertLessEqual(start.year, 2027)
            self.assertGreaterEqual((start.replace(year=start.year) -
                                     date(2027, 1, 1)).days, -6)
        self.assertTrue(any(start == date(2027, 12, 27) for start in starts))

    def test_each_page_has_a_unique_named_destination(self):
        destinations = self.reader.named_destinations
        expected_count = len(self.reader.pages)
        for page_number in range(1, expected_count + 1):
            self.assertIn("page-%04d" % page_number, destinations)
        self.assertEqual(
            len([name for name in destinations if name.startswith("page-")]),
            expected_count,
        )

    def test_internal_link_annotations_point_to_valid_pages(self):
        link_count = 0
        for page in self.reader.pages:
            for annotation_ref in page.get("/Annots", []):
                annotation = annotation_ref.get_object()
                if annotation.get("/Subtype") != "/Link":
                    continue
                destination = annotation.get("/Dest")
                action = annotation.get("/A")
                if destination is None and action:
                    if action.get("/S") == "/GoTo":
                        destination = action.get("/D")
                self.assertIsNotNone(destination, "link must be an internal PDF link")
                if isinstance(destination, (list, tuple)) or (
                    hasattr(destination, "__getitem__") and
                    not isinstance(destination, (str, bytes))
                ):
                    target_page = destination[0]
                    self.assertTrue(
                        any(target_page == candidate.indirect_reference
                            for candidate in self.reader.pages),
                        "link destination must reference a page in this PDF",
                    )
                else:
                    self.assertIn(str(destination).lstrip("/"),
                                  self.reader.named_destinations)
                link_count += 1
        self.assertGreater(link_count, 0)

    def test_major_sections_have_pdf_outline_bookmarks(self):
        def flatten(outline):
            for item in outline:
                if isinstance(item, list):
                    yield from flatten(item)
                else:
                    yield item

        titles = {
            item.title for item in flatten(self.reader.outline)
            if getattr(item, "title", None)
        }
        for title in (
            "Cover",
            "Home / Contents",
            "Goals & Yearly Overview",
            "Monthly Planning",
            "Weekly Planning",
            "Daily Planning",
            "Notes & Reflection",
        ):
            self.assertIn(title, titles)


if __name__ == "__main__":
    unittest.main()
