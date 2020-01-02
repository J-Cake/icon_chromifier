import * as p5 from "p5";

import pixelTransform from "./pixelTransform";
import outLiner, {toGrid} from "./outLiner";

function gen(threshold: number, radius: number, url: string): p5 {
    const form: HTMLDivElement = <HTMLDivElement>document.querySelector("#parameters");

    form.setAttribute('data-status', '1');

    // noinspection JSPotentiallyInvalidConstructorUsage
    return new p5(function (sketch: p5) {
        form.setAttribute('data-status', '2');

        const images: p5.Image[] = [];
        const transformed: p5.Image[] = [];

        sketch.preload = function () {
            form.setAttribute('data-status', '3');
            images.push(sketch.loadImage(`/images?url=${encodeURIComponent(
                url)}`));
            // images.push(sketch.loadImage("./res/icon.png"));
        };

        sketch.setup = async function () {
            form.setAttribute('data-status', '4');
            images[0].loadPixels();

            sketch
                .createCanvas(images.map(i => i.width).reduce((a, i) => i < a ? a : i), images.map(i => i.height).reduce((a, i) => a + i))
                .parent("container");

            transformed.push(await (async function (input: p5.Image): Promise<p5.Image> {
                const image = await outLiner({
                    width: images[0].width,
                    height: images[0].height,
                    pixels: pixelTransform(input.pixels)
                }, threshold, 1);

                const img: p5.Image = sketch.createImage(image.width, image.height);
                img.loadPixels();

                for (const _a in image.pixels) {
                    const a = Number(_a);
                    const coords: { x: number, y: number } = toGrid(Number(a), image.width);

                    const pixel = image.pixels[a];

                    img.set(coords.x, coords.y, [pixel.red, pixel.green, pixel.blue, pixel.alpha]);
                }

                img.updatePixels();

                return img;
            })(images[0]));

            form.setAttribute('data-status', '5');
        };

        sketch.draw = function () {
            let index = 0;
            for (const image of transformed) {
                sketch.image(image, 0, 0);

                index++;
            }
        };
    });
}

const images: p5[] = [];

(<HTMLButtonElement>document.querySelector("#ok")).addEventListener("click", function () {
    (<HTMLDivElement>document.querySelector("#parameters")).setAttribute('data-status', '0');
    (<HTMLDivElement>document.querySelector("#parameters")).style.display = "none";

    (<HTMLElement>document.querySelector("#container")).innerHTML = ``;

    const url: string = (<HTMLInputElement>document.querySelector("#url")).value || "-";
    const threshold: number = Number((<HTMLInputElement>document.querySelector("#threshold")).value);
    const radius: number = Number((<HTMLInputElement>document.querySelector("#radius")).value);

    if (url && threshold && radius)
        images.push(gen(threshold, radius, url));
});

function reveal() {
    (<HTMLDivElement>document.querySelector("#parameters")).style.display = "block";
    (<HTMLDivElement>document.querySelector("#parameters")).setAttribute('data-status', '0');
}

(<HTMLButtonElement>document.querySelector("#close")).addEventListener("click", function () {
    images.pop();

    (<HTMLElement>document.querySelector("#container")).innerHTML = ``;

    reveal();
});

(<HTMLButtonElement>document.querySelector("#open")).addEventListener("click", reveal);