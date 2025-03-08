import React, { useRef } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

// Default allowed MIME types for valid formats
const DEFAULT_ALLOWED_TYPES = [
    "image/jpeg", // .jpg, .jpeg
    "image/png",  // .png
    "application/pdf", // .pdf
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "audio/mpeg", // .mp3
    "video/mp4"   // .mp4
];

// Default max file size: 10MB
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

const HiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export const CustomFileUploadWrapper = ({
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    maxSize = DEFAULT_MAX_SIZE,
    onFileSelect,
    buttonText = "Upload file",
    multiple = false,
    // By default, single file upload; pass multiple={true} to allow multi-select
    ...rest
}) => {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const files = e.target.files;
        if (!files || !files.length) return;

        // Check if multi-select is enabled (either via prop or input attribute)
        const isMultiple = rest.multiple || e.target.multiple;

        // Multi-select logic: filter out invalid files and pass the valid ones
        if (isMultiple) {
            const dataTransfer = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file format using MIME type
                if (allowedTypes.length && !allowedTypes.includes(file.type)) {
                    toast.error(
                        `Unsupported file format for ${file.name}.`,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        }
                    );
                    continue; // Skip invalid file
                }

                // Validate file size
                if (file.size > maxSize) {
                    toast.error(
                        `File size for ${file.name} exceeds the maximum limit of ${maxSize / (1024 * 1024)} MB.`,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        }
                    );
                    continue; // Skip invalid file
                }

                // Add valid file to the DataTransfer object
                dataTransfer.items.add(file);
            }

            // If there are no valid files, clear the input and exit
            if (dataTransfer.files.length === 0) {
                e.target.value = "";
                return;
            }

            // Call onFileSelect with a simulated event containing only valid files
            if (onFileSelect) {
                onFileSelect({ target: { files: dataTransfer.files } });
            }
        } else {
            // Single file upload logic
            const file = files[0];

            // Validate file format using MIME type
            if (allowedTypes.length && !allowedTypes.includes(file.type)) {
                toast.error(`Unsupported file format.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                e.target.value = "";
                return;
            }

            // Validate file size
            if (file.size > maxSize) {
                toast.error(
                    `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)} MB.`,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }
                );
                e.target.value = "";
                return;
            }

            // If valid, pass the original event
            if (onFileSelect) {
                onFileSelect(e);
            }
        }
    };

    return (
        <>
            <HiddenInput
                type="file"
                ref={inputRef}
                onChange={handleChange}
                {...rest}
            />
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => inputRef.current && inputRef.current.click()}
            >
                {buttonText}
            </Button>
        </>
    );
};
