import { Crop as CropIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import 'react-image-crop/dist/ReactCrop.css';

interface PhotoUploadProps {
    name?: string;
    defaultValue?: string | null;
    error?: string;
    disabled?: boolean;
}

const MAX_SIZE = 800;

function centerSquare(width: number, height: number): Crop {
    return centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, width, height), width, height);
}

function cropToFile(image: HTMLImageElement, crop: PixelCrop): Promise<File> {
    const scale = image.naturalWidth / image.width;
    const size = Math.min(Math.round(crop.width * scale), MAX_SIZE);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    context?.drawImage(
        image,
        crop.x * scale,
        crop.y * scale,
        crop.width * scale,
        crop.height * scale,
        0,
        0,
        size,
        size,
    );

    return new Promise((resolve, reject) => {
        const handleBlob = (blob: Blob | null) => {
            if (!blob) {
                reject();

                return;
            }

            resolve(new File([blob], 'picture.jpg', { type: 'image/jpeg' }));
        };

        canvas.toBlob(handleBlob, 'image/jpeg', 0.9);
    });
}

export function PhotoUpload({ name = 'picture', defaultValue, error, disabled }: PhotoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [preview, setPreview] = useState(defaultValue ?? null);
    const [removed, setRemoved] = useState(false);
    const [source, setSource] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [pixelCrop, setPixelCrop] = useState<PixelCrop>();

    const emptyFileInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSource(URL.createObjectURL(file));
        }
    };

    const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const square = centerSquare(width, height);

        setCrop(square);
        setPixelCrop(convertToPixelCrop(square, width, height));
    };

    const cancelCrop = () => {
        setSource(null);
        emptyFileInput();
    };

    const handleDialogChange = (open: boolean) => {
        if (!open) {
            cancelCrop();
        }
    };

    const saveCrop = async () => {
        if (!imageRef.current || !pixelCrop || !inputRef.current) {
            return;
        }

        const file = await cropToFile(imageRef.current, pixelCrop);
        const transfer = new DataTransfer();
        transfer.items.add(file);
        inputRef.current.files = transfer.files;

        setPreview(URL.createObjectURL(file));
        setRemoved(false);
        setSource(null);
    };

    const removePicture = () => {
        emptyFileInput();
        setPreview(null);
        setRemoved(true);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <input
                ref={inputRef}
                type="file"
                name={name}
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={handleFileChange}
            />
            <input type="hidden" name="remove_picture" value={removed ? '1' : '0'} />

            {preview ? (
                <div
                    className="group relative size-32 overflow-hidden rounded-full border shadow-md"
                >
                    <img
                        src={preview}
                        alt=""
                        className="size-full object-cover"
                        onError={() => setPreview(null)}
                    />
                    {!disabled && (
                        <button
                            type="button"
                            aria-label="Kép eltávolítása"
                            onClick={removePicture}
                            className="absolute inset-0 flex items-center justify-center
                                bg-black/50 text-white opacity-0 transition-opacity
                                group-hover:opacity-100"
                        >
                            <X className="size-6" />
                        </button>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    aria-label="Kép feltöltése"
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                    className="flex size-32 cursor-pointer items-center justify-center rounded-full
                        border border-dashed text-muted-foreground hover:border-main
                        hover:text-main"
                >
                    <Upload className="size-5" />
                </button>
            )}

            {error && <FieldError>{error}</FieldError>}

            <Dialog open={source !== null} onOpenChange={handleDialogChange}>
                <DialogContent>
                    <DialogTitle>Kép kivágása</DialogTitle>
                    {source && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(completed) => setPixelCrop(completed)}
                            aspect={1}
                            circularCrop
                            keepSelection
                        >
                            <img
                                ref={imageRef}
                                src={source}
                                alt=""
                                className="max-h-[60vh]"
                                onLoad={handleImageLoad}
                            />
                        </ReactCrop>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={cancelCrop}>
                            Mégse
                        </Button>
                        <Button type="button" onClick={saveCrop}>
                            <CropIcon /> Kivágás
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
