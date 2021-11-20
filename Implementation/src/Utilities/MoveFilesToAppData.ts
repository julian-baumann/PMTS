import electron from "electron";
import fs from "fs-extra";

export function MoveFilesToAppData(originalPath: string): void
{
    let filePath: string = originalPath;
    const userDataPath: string = (electron.app || electron.remote.app).getPath("userData");

    if (originalPath.startsWith("$ExtraResources/"))
    {
        if (process.env.APP_DEV)
        {
            return;
        }

        const rootDirectory: string  = `${process.resourcesPath}/ExtraResources`;

        filePath = `${rootDirectory}/${originalPath.split("$ExtraResources/")[1]}`;
    }

    fs.copySync(filePath, `${userDataPath}/${originalPath.split("$ExtraResources/")[1]}`, { overwrite: true });
}