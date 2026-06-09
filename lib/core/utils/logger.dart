import 'package:logger/logger.dart';

/// A globally accessible [Logger] instance configured for the application.
/// 
/// It uses a [PrettyPrinter] to format output with colors, emojis, and time information.
final Logger appLogger = Logger(
  printer: PrettyPrinter(
    methodCount: 0, // Number of method calls to be displayed.
    errorMethodCount: 5, // Number of method calls if stacktrace is provided.
    lineLength: 80, // Width of the output.
    colors: true, // Colorful log messages.
    printEmojis: true, // Print an emoji for each log message.
    dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart, // Only display time and duration.
  ),
);
