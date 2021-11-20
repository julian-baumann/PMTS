
// Get elements
const input: HTMLInputElement = document.getElementById("FileInput") as HTMLInputElement;
const dropArea: HTMLDivElement = document.getElementById("DropArea") as HTMLDivElement;
const LinkInput: HTMLInputElement = document.getElementById("LinkInput") as HTMLInputElement;


// Variables
let isDraggingFile: boolean = false;


// Subscribe to events
dropArea.addEventListener("dragenter", DragEnter.bind(this), false);
dropArea.addEventListener("dragleave", DragLeave.bind(this), false);
dropArea.addEventListener("dragover", DragOver.bind(this), false);
dropArea.addEventListener("drop", Drop.bind(this), false);


// Helper functions
function HideElement(elementId: string): void
{
    AddClass(elementId, "Hidden");
}

function ShowElement(elementId: string): void
{
    RemoveClass(elementId, "Hidden");
}

function AddClass(elementId: string, className: string): void
{
    const element: HTMLElement = document.getElementById(elementId);
    element.classList.add(className);
}

function RemoveClass(elementId: string, className: string): void
{
    const element: HTMLElement = document.getElementById(elementId);
    element.classList.remove(className);
}

// Handle Drag and drop
function DragEnter(event: Event): void
{
    event.preventDefault();
    isDraggingFile = true;
    AddClass("DropArea", "IsDragging");
    ShowElement("DropToSelectBox");
    HideElement("SelectFilesBox");
}

function DragLeave(event: Event): void
{
    event.preventDefault();
    isDraggingFile = false;
    RemoveClass("DropArea", "IsDragging");
    HideElement("DropToSelectBox");
    ShowElement("SelectFilesBox");
}

function DragOver(event: Event): void
{
    event.preventDefault();
}

function Drop(event: any): void
{
    event.preventDefault();

    isDraggingFile = false;
    RemoveClass("DropArea", "IsDragging");
    HideElement("DropToSelectBox");
    ShowElement("SelectFilesBox");
    const files: Array<File> = event.dataTransfer.files;

    if (files.length > 0)
    {
        SendFile(files[0]);
    }
}

// Other function declarations

function OpenFileSelect(): void
{
    input.click();
}

function SendFromInput(): void
{
    SendFile(input.files[0]);
}

function StopPlayback(): void
{
    fetch(`http://${serverAddress}:8010/stop-playback`);
}

function OnKeyPressInLinkInput(event: any): void
{
    if (event.keyCode === 13)
    {
        event.preventDefault();
        OpenLink();
    }
}

function OpenLink(): void
{
    const link: string = LinkInput.value;

    if (link)
    {
        fetch(`http://${serverAddress}:8010/upload/link?url=${link}`);
    }
}


async function SendFile(file: File): Promise<void>
{
    const formData: FormData = new FormData();

    formData.append("file", file);

    await fetch(`http://${serverAddress}:8010/upload`, {
        method: "POST",
        body: formData
    });

    input.value = null;
}


// WebSocket
const socket: WebSocket = new WebSocket(`ws://${serverAddress}:8011`);
socket.addEventListener("message", (message: any): any =>
{
    console.log(message.data);
    switch(message.data)
    {
        case "IsPlaying":
            ShowElement("Controls");
            break;

        case "IsNotPlaying":
        case "PlaybackStopped":
            HideElement("Controls");
            break;
    }
});