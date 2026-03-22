import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const defaultPoemsFile = path.resolve(
  projectRoot,
  "..",
  "old version",
  "Nueva_carpeta",
  "POEMAS_UNIFICADOS.txt",
);

const mimeFromPath = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
};

const fileToDataUrl = async (filePath) => {
  const buf = await fs.readFile(filePath);
  const mime = mimeFromPath(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
};

const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
};

const parsePoems = (content) => {
  const normalized = content.replace(/\r\n/g, "\n");
  const blocks = normalized
    .split(/(?:^|\n)=== POEMA DESDE: [^\n]+ ===\n/)
    .filter(Boolean);

  return blocks
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      const lines = b.split("\n");
      const nonEmptyIndex = lines.findIndex((l) => l.trim().length > 0);
      const title = nonEmptyIndex === -1 ? "Sin título" : lines[nonEmptyIndex].trim();
      const bodyLines = lines.slice(nonEmptyIndex + 1);
      const body = bodyLines.join("\n").trim();
      return { title, body };
    })
    .filter((p) => p.body.length > 0);
};

const pickRandom = (items) => {
  if (items.length === 0) throw new Error("No hay poemas para seleccionar.");
  const i = Math.floor(Math.random() * items.length);
  return { item: items[i], index: i };
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));

  const poemsFile = args["poems-file"]
    ? path.resolve(process.cwd(), args["poems-file"])
    : defaultPoemsFile;

  const outFile = args["out"]
    ? path.resolve(process.cwd(), args["out"])
    : path.resolve(projectRoot, "props", "book-poem.json");

  const poemsContent = await fs.readFile(poemsFile, "utf8");
  const poems = parsePoems(poemsContent);

  const poemIndexArg = args["poem-index"];
  const picked =
    typeof poemIndexArg === "string" && Number.isFinite(Number(poemIndexArg))
      ? { item: poems[Number(poemIndexArg)], index: Number(poemIndexArg) }
      : pickRandom(poems);

  if (!picked.item) {
    throw new Error(`No se encontró poema para poem-index=${poemIndexArg}`);
  }

  const title = typeof args["title"] === "string" ? args["title"] : picked.item.title;
  const text = typeof args["text"] === "string" ? args["text"] : picked.item.body;

  const watermarkText =
    typeof args["watermark"] === "string" ? args["watermark"] : "Cristian Prince";
  const page = typeof args["page"] === "string" ? args["page"] : "1";

  const props = {
    title,
    text,
    page,
    watermarkText,
    hideWatermark: args["hide-watermark"] === true,
    textCenter: args["text-center"] === true,
    topShift: args["top-shift"] === true,
    sepia: args["sepia"] === true,
    onlyText: args["only-text"] === true,
    tiltDeg:
      typeof args.tilt === "string"
        ? Number(args.tilt)
        : typeof args["tilt-deg"] === "string"
          ? Number(args["tilt-deg"])
          : 0,
    zoomFrom: typeof args["zoom-from"] === "string" ? Number(args["zoom-from"]) : 1,
    zoomTo: typeof args["zoom-to"] === "string" ? Number(args["zoom-to"]) : 1.08,
    zoomOriginX:
      typeof args["zoom-origin-x"] === "string" ? Number(args["zoom-origin-x"]) : 0.65,
    zoomOriginY:
      typeof args["zoom-origin-y"] === "string" ? Number(args["zoom-origin-y"]) : 0.44,
    _pickedPoemIndex: picked.index,
    _pickedPoemFile: poemsFile,
  };

  if (typeof args.background === "string") {
    props.backgroundSrc = await fileToDataUrl(path.resolve(process.cwd(), args.background));
  }

  if (typeof args.overlay === "string") {
    props.overlaySrc = await fileToDataUrl(path.resolve(process.cwd(), args.overlay));
  }

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(props, null, 2), "utf8");
  process.stdout.write(`Props generadas: ${outFile}\n`);
};

main().catch((err) => {
  process.stderr.write(`${err?.stack ?? err}\n`);
  process.exit(1);
});
