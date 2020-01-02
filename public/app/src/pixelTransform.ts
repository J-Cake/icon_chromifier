type Pixel = {
    red: number,
    green: number,
    blue: number,
    alpha: number
};

export default function transform(pixels: number[], channels: number = 4): Pixel[] {
    const output: Pixel[] = [];

    if (pixels.length % channels === 0) // check if each pixel has all four channels
        for (let i = 0; i < pixels.length; i += 4) {
            output.push({
                red:   pixels[i],
                green: pixels[i + 1],
                blue:  pixels[i + 2],
                alpha: pixels[i + 3]
            })
        }
    else
        return [];

    return output;
}