'use client'

export const convertToWebP = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], `${file.name}.webp`, { type: 'image/webp' }));
                }, 'image/webp', 0.65);
            };
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};