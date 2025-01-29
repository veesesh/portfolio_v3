import { useState } from "react";

interface DesignProp {
    designImages: {
        src: string;
        alt: string;
    }[];
}

export default function Design({ designImages }: DesignProp) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setImageIndex(index);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <section>
                <div className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 row-span-2 cursor-pointer">
                            <img
                                src={designImages[0].src}
                                alt={designImages[0].alt}
                                width={600}
                                height={400}
                                onClick={() => handleImageClick(0)}
                                className="w-full h-full object-cover border border-border-contrast muted-image"
                            />
                        </div>
                        {designImages.slice(1).map((image, index) => (
                            <div className="relative cursor-pointer" key={index}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    width={300}
                                    height={200}
                                    onClick={() => handleImageClick(index + 1)}
                                    className="w-full h-full object-cover border border-border-contrast muted-image"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ImageDialog
                isOpen={isOpen}
                src={designImages[imageIndex].src}
                alt={designImages[imageIndex].alt}
                onClose={handleClose}
            />
        </>
    );
}

interface ImageDialogProps {
    isOpen: boolean;
    src: string;
    alt: string;
    onClose: () => void;
}

function ImageDialog({ isOpen, src, alt, onClose }: ImageDialogProps) {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-6 bg-white/70 transition-opacity duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
            onClick={onClose}
        >
            <ShadedBox>
                <div
                    className="relative flex max-h-[90vh] max-w-6xl w-full items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <img
                        src={src}
                        alt={alt}
                        className="mx-auto h-auto max-h-[85vh] w-auto max-w-full object-contain"
                    />
                </div>
            </ShadedBox>
        </div>
    );
}

function ShadedBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <div className="relative border-2 bg-white border-border-contrast p-1 after:bg-dotted after:absolute after:-bottom-2 after:-right-2 after:left-2 after:top-2 after:-z-10 after:content-['']">
                {children}
            </div>
        </div>
    );
}
