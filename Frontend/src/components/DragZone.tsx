import React, { useCallback, type RefObject } from 'react'
import { useDropzone, type FileRejection, type FileWithPath } from 'react-dropzone'
import { Button } from './ui/button'
import { Label } from './ui/label'

interface DragZoneProps {
    className: string,
    setSelectedFile: (file: FileWithPath | null) => void,
    setRejectedFile: (file: FileRejection | null) => void,
    inputRef: RefObject<HTMLInputElement | null>,
    onClick: () => void;
}

export default function DragZone({ className, setSelectedFile, setRejectedFile, inputRef, onClick }: DragZoneProps) {
    const onDrop = useCallback((acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
        if (acceptedFiles.length == 1) {
            setSelectedFile(acceptedFiles[0])
            setRejectedFile(null)
        }
        else {
            setRejectedFile(fileRejections[0])
        }
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'application/rtf': ['.rtf']
        },
        maxSize: 1024 * 5000
    })

    return (
        <div {...getRootProps({
            className: className,
            onClick: onClick
        })}>
            <input {...getInputProps()} ref={inputRef} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <>
                        <Button>Upload a CV</Button>
                        <p className="text-gray-600">or</p>
                        <Label htmlFor="resume">
                            Drag and Drop a file here
                        </Label>
                    </>
            }
        </div>
    )
}