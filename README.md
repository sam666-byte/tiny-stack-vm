# Tiny Stack VM

A tiny stack virtual machine for make.fun's tiny-stack-vm-01 ISA (version 1),
written from `generator/subject/ISA.md` only.

Run: `node main.ts [inputRoot] [outputRoot]` (defaults `/input`, `/output`).
For each instance `i001`..`i040` it reads `program.bin` + `input.bin` and writes
`stdout.bin` and `exit.txt` (decimal 0-255).

Implements the whole ISA: 32-bit wrapping arithmetic, a 256-value data stack,
a 64-deep call stack, 256 words of memory, input/output, and all ten traps
with their exact exit codes, plus the 1,000,000-step and 65,536-byte limits.
Deterministic: no clock, no randomness, no network, no other files.
