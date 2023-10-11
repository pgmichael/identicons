import { v4 as uuidv4 } from 'uuid';
import { createLogger, format, transports } from 'winston';

// Canvas utils ---------------------------------------------------------------
export function generateHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return hash
}

export function intToRGB(i) {
  let c = (i & 0x00ffffff).toString(16).toUpperCase()
  return '00000'.substring(0, 6 - c.length) + c
}

export function lighten(color, factor = 175) {
  const [r, g, b] = [
    Math.min(parseInt(color.slice(1, 3), 16) + factor, 255),
    Math.min(parseInt(color.slice(3, 5), 16) + factor, 255),
    Math.min(parseInt(color.slice(5, 7), 16) + factor, 255),
  ]

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Logging utils ---------------------------------------------------------------
const logger = createLogger({
  level: 'info',
  transports: [new transports.Console()],
});

export function loggingMiddleware(req, res, next) {
  const start = new Date();
  const startDateTime = start.toISOString();
  const method = req.method.toUpperCase();
  const id = uuidv4();
  const url = req.url;
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const initialLogEntry = formatLogEntry({ method, startDateTime, clientIp, url, id });
  logger.info(initialLogEntry, {
    method,
    url,
    id,
    clientIp,
    startDateTime: start.toISOString(),
  });

  res.on("finish", () => {
    const timeTaken = Date.now() - start.getTime();
    const status = res.statusCode;

    const finalLogEntry = formatLogEntry({ method, startDateTime, timeTaken, id, clientIp, status, url })
    logger.info(finalLogEntry, {
      method,
      url,
      id,
      clientIp,
      status,
      timeTaken,
    });
  });

  next();
}

function formatLogEntry({ method, startDateTime, timeTaken = 'N/A', id = 'N/A', clientIp, status = 'N/A', url }) {
  return `${`[${method}]`.padEnd(8)} Start: ${startDateTime} | Time: ${timeTaken.toString().padEnd(8)} | ID: ${id} | Client IP: ${(clientIp || "").padEnd(15)} | Status: ${status.toString().padEnd(3)} | URL: ${url}`;
}

