// Require dependencies
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import dotenv from 'dotenv';

dotenv.config();

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: `${
      process.env.OTLP_COLLECTOR_BASE || 'http://localhost:4318'
    }/v1/traces`,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
    // an optional limit on pending requests
    concurrencyLimit: 10,
  }),
  instrumentations: [
    // basically does every intrumentation for us, can fine tune later if needed
    // https://opentelemetry.io/registry/?language=js&component=instrumentation
    getNodeAutoInstrumentations(),
    new PrismaInstrumentation(),
  ],
});

sdk.start();
