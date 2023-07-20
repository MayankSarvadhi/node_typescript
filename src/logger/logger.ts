export function logger(level: string, message: string) {
    const now = new Date();
    const formattedMessage = `[${now}] ${level}: ${message}`;
    console.log(formattedMessage);

} 