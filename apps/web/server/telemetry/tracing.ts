import { NodeSDK } from '@opentelemetry/sdk-node';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { PrismaInstrumentation } from '@prisma/instrumentation';

// why we use such old versions of OTEL
// https://github.com/open-telemetry/opentelemetry-js/issues/3521

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new PrismaInstrumentation(),
  ],
  resourceDetectors: [containerDetector],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
});

sdk.start();

console.log('Telemetry started');
