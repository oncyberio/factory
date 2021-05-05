import { transports, format, createLogger, Logger } from 'winston'

const Log = (defaultMeta = {}): Logger =>
  createLogger({
    format: format.combine(format.timestamp(), format.prettyPrint()),
    defaultMeta,
    transports: [new transports.Console()],
  })

export { Log }
