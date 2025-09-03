import argparse
import json
from pathlib import Path
import fitz  # PyMuPDF

# If you already have LayoutLMv3 text, pass it in via --text-file.
# Otherwise we fall back to a simple PDF text extractor (PyMuPDF).
def _extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = [p.get_text("text") for p in doc]
    return "\n\n".join(pages)

# def main():
#     parser = argparse.ArgumentParser()
#     parser.add_argument("--input", required=True, help="Path to PDF/DOCX/TXT")
#     parser.add_argument("--doc-id", required=True)
#     parser.add_argument("--outdir", required=True)
#     parser.add_argument("--text-file", help="Optional: path to pre-extracted plain text")
#     args = parser.parse_args()

#     # 1) get raw text
#     if args.text_file:
#         raw_text = Path(args.text_file).read_text(encoding="utf-8", errors="ignore")
#     else:
#         in_path = Path(args.input)
#         if in_path.suffix.lower() == ".pdf":
#             raw_text = _extract_text_from_pdf(str(in_path))
#         elif in_path.suffix.lower() in {".txt"}:
#             raw_text = in_path.read_text(encoding="utf-8", errors="ignore")
#         else:
#             raise SystemExit(f"Unsupported input type: {in_path.suffix}. Provide --text-file for extracted text.")

#     # 2) segment
#     from clause_segmenter import segment
#     clauses = segment(raw_text)

#     # 3) write correct JSON schema
#     out = {"document_id": args.doc_id, "clauses": clauses}
#     outdir = Path(args.outdir)
#     outdir.mkdir(parents=True, exist_ok=True)
#     outfile = outdir / f"{args.doc_id}_extracted.json"
#     outfile.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
#     print(f"Wrote {outfile}")

# if __name__ == "__main__":
#     main()
