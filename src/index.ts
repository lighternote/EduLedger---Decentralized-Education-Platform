import app, { PORT } from './api';

// Start the server
const server = app.listen(PORT, () => {
  console.log('🚀 EduLedger server started successfully');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default server;
