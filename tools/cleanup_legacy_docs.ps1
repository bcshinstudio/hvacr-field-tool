# Run this ONLY after verifying README.md and docs/knowledge_coverage.md are present.
$ErrorActionPreference = 'Stop'
if (-not (Test-Path 'README.md') -or -not (Test-Path 'docs/knowledge_coverage.md')) { throw 'Consolidated documentation is missing.' }
if (Test-Path "DIAGNOSTIC_AUDIT.txt") { Remove-Item -LiteralPath "DIAGNOSTIC_AUDIT.txt" }
if (Test-Path "PATCH_NOTES.txt") { Remove-Item -LiteralPath "PATCH_NOTES.txt" }
if (Test-Path "PHASE3_INSTALL.txt") { Remove-Item -LiteralPath "PHASE3_INSTALL.txt" }
if (Test-Path "PHASE4_README.txt") { Remove-Item -LiteralPath "PHASE4_README.txt" }
if (Test-Path "PHASE5_README.txt") { Remove-Item -LiteralPath "PHASE5_README.txt" }
if (Test-Path "README_INSTALL.txt") { Remove-Item -LiteralPath "README_INSTALL.txt" }
if (Test-Path "docs/KNOWLEDGE_PHASE2_README.md") { Remove-Item -LiteralPath "docs/KNOWLEDGE_PHASE2_README.md" }
if (Test-Path "docs/knowledge_coverage_phase2.md") { Remove-Item -LiteralPath "docs/knowledge_coverage_phase2.md" }
if (Test-Path "docs/knowledge_coverage_phase2.json") { Remove-Item -LiteralPath "docs/knowledge_coverage_phase2.json" }
if (Test-Path "docs/knowledge_coverage_phase3.md") { Remove-Item -LiteralPath "docs/knowledge_coverage_phase3.md" }
if (Test-Path "docs/knowledge_coverage_phase3.json") { Remove-Item -LiteralPath "docs/knowledge_coverage_phase3.json" }
if (Test-Path "docs/knowledge_coverage_phase4.md") { Remove-Item -LiteralPath "docs/knowledge_coverage_phase4.md" }
if (Test-Path "docs/knowledge_coverage_phase4.json") { Remove-Item -LiteralPath "docs/knowledge_coverage_phase4.json" }
