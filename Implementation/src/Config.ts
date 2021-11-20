import { FileExists } from "./Utilities/FileExists";
import { ReadFile } from "./Utilities/ReadFile";

export const Config: any = FileExists("$AppData/Resources/Config.json") ? ReadFile("$AppData/Resources/Config.json", true) : null;