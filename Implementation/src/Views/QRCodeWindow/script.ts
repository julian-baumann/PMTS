const ipAddress: string = new URL(window.location.href).searchParams.get("ip");
const port: string = new URL(window.location.href).searchParams.get("port");

const qrCodeImage: HTMLImageElement = document.getElementById("QrCodeImage") as HTMLImageElement;

qrCodeImage.src = `http://${ipAddress}:${port}/qr-code`;
