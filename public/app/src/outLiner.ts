export type Pixel = {
    red: number,
    green: number,
    blue: number,
    alpha: number
};
export type PixelMap = {
    width: number,
    height: number,
    pixels: Pixel[]
};

export function toLinear(x: number, y: number, width: number, height: number = Infinity): number { // convert 2d coordinates into a single linear array index
    return Math.min(Math.max(y * width + x, 0), width * height);
}

export function toGrid(index: number, width: number): { x: number, y: number } { // convert an array index into 2d coordinates
    return {
        x: Math.min((Math.max(index % width, 0)), width),
        y: Math.floor(index / width)
    }
}

export function difference(pixelA: Pixel, pixelB: Pixel): number { // calculate the difference between two colours
    if (!pixelA || !pixelB)
        return -1;

    return (
        Math.abs(pixelA.red - pixelB.red) +
        Math.abs(pixelA.green - pixelB.green) +
        Math.abs(pixelA.blue - pixelB.blue) +
        Math.abs(pixelA.alpha - pixelB.alpha)
    ) / 4;
}

export function print(item: any, transform?: Function, alwaysPrint: boolean = true): any { // allows printing of items with transformer functions while maintaining proper code flow
    if (transform) {
        const transformed = transform(item);

        if (alwaysPrint)
            console.log(transformed);
        else if (transformed !== null)
            console.log(transformed);
    } else
        console.log(item);

    return item;
}

export default async function outLiner(image: PixelMap, threshold: number, radius: number = 1, graded: boolean = false): Promise<PixelMap> { // generate outlines of major shapes in an image
    const outputPixels: PixelMap = {
        width: image.width,
        height: image.height,
        pixels: []
    };

    for (const _a in image.pixels) {
        const a = Number(_a);

        const pixel = image.pixels[a];
        const coords: { x: number, y: number } = toGrid(a, image.width);

        // 1) Iterate over every pixel
        // 2) compare the rate of change to the pixel to the left and the pixel to the right.
        // 3 - a) if value is greater than threshold, increase output value by 25%
        // 3 - b) otherwise do nothing
        // 4) repeat for pixels on top and bottom

        enum Dir {
            top = 0,
            bottom = 1,
            left = 2,
            right = 3,
        }

        const diff = function (radius: number, direction: Dir) { // calculate the difference between two pixels with respect to pixels between. for graded images
            const diffs: number[] = [];

            for (let i = 0; i < radius; i++) {
                switch (direction) {
                    case Dir.top:
                        diffs.push(difference(
                            image.pixels[toLinear(coords.x, coords.y - i, image.width, image.height)],
                            pixel
                        ));
                        break;
                    case Dir.bottom:
                        diffs.push(difference(
                            image.pixels[toLinear(coords.x, coords.y + i, image.width, image.height)],
                            pixel
                        ));
                        break;
                    case Dir.left:
                        diffs.push(difference(
                            image.pixels[toLinear(coords.x - i, coords.y, image.width, image.height)],
                            pixel
                        ));
                        break;
                    case Dir.right:
                        diffs.push(difference(
                            image.pixels[toLinear(coords.x + i, coords.y, image.width, image.height)],
                            pixel
                        ));
                        break;
                }
            }

            return diffs.reduce((a, i) => a + i) / diffs.length;
        };

        const differences: { top: number, bottom: number, left: number, right: number } = graded ? { // calculate the differences between the pixels in each direction
                top: diff(radius, Dir.top),
                bottom: diff(radius, Dir.bottom),
                left: diff(radius, Dir.left),
                right: diff(radius, Dir.right)
            } : { // calculate the difference between pixels skipping pixels in between
                top: difference(
                    image.pixels[toLinear(coords.x, coords.y - radius, image.width, image.height)],
                    pixel
                ),
                bottom: difference(
                    image.pixels[toLinear(coords.x, coords.y + radius, image.width, image.height)],
                    pixel
                ),
                left: difference(
                    image.pixels[toLinear(coords.x - radius, coords.y, image.width, image.height)],
                    pixel
                ),
                right: difference(
                    image.pixels[toLinear(coords.x + radius, coords.y, image.width, image.height)],
                    pixel
                )
            };

        let total = 0;
        for (const key of Object.keys(differences)) { // this would have been so much easier if done line-by-line but eh
            // @ts-ignore
            const value = differences[key];

            if (value > threshold)
                total++;
        }

        const value = total * 64; // one quarter of 256

        if (graded)
            outputPixels.pixels[a] = {
                red: value > 64 ? 255 : 0,
                green: value > 128 ? 255 : 0,
                blue: value > 192 ? 255 : 0,
                alpha: 255
            };
        else
            outputPixels.pixels[a] = {
                red: value !== 0 ? 255 : 0,
                green: value !== 0 ? 255 : 0,
                blue: value !== 0 ? 255 : 0,
                alpha: 100
            }
    }

    return outputPixels;
}