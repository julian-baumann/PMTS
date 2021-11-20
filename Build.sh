#!/bin/bash

# Colors
RedColor="\\033[0;31m"
DefaultColor="\\033[0m"
GreenColor="\\033[0;32m"
BlueColor="\\033[0;34m"

Artifacts=( AppImage deb tar.gz exe dmg )
ExportDirectory="Bin"

function Print
{
    echo -e "$1$2${DefaultColor}"
}

function PrintStatus
{
    if [ "$1" != "0" ]
    then
        Print $RedColor "Error\n"
    else
        Print $GreenColor "Done\n"
    fi
}

function Build
{
    npm run electron-build-$1
    PrintStatus "$?"
}

function CopyFiles
{
    rm -rf "$ExportDirectory"
    mkdir -p "$ExportDirectory"

    for artifact in "${Artifacts[@]}";
    do
        find "Implementation/dist" -maxdepth 1 -name *.$artifact -exec cp {} $ExportDirectory \;
        if [ ! -f $ExportDirectory/*.$artifact ]; then
            Print $RedColor "Artifact *.$artifact not found."
        fi
    done
}

function Start
{
    cd Implementation;
    rm -rf dist/;

    npm run build 

    Print $BlueColor "Building for Linux"
    Build linux

    Print $BlueColor "Building for macOS"
    Build mac
    
    Print $BlueColor "Building for Windows"
    Build win

    cd ../

    CopyFiles
}

Start;
