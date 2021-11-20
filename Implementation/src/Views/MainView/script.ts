export {};

const ipAddress: string = new URL(window.location.href).searchParams.get("ip");
const port: string = new URL(window.location.href).searchParams.get("port");

const ipAddressTextElement: HTMLParagraphElement = document.getElementById("IpAddressText") as HTMLParagraphElement;

ipAddressTextElement.innerHTML = `Client now available at http://${ipAddress}:${port}`;