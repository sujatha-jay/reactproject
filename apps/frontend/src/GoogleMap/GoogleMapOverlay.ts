// // This example adds hide() and show() methods to a custom overlay's prototype.
// // These methods toggle the visibility of the container <div>.
// // overlay to or from the map.
// //

//
class USGSOverlay extends google.maps.OverlayView {
    private bounds: google.maps.LatLngBounds;
    private image: string;
    private div?: HTMLElement;

    constructor(bounds: google.maps.LatLngBounds, image: string) {
        super();

        this.bounds = bounds;
        this.image = image;
    }

    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    onAdd() {
        this.div = document.createElement("div");
        this.div.style.borderStyle = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";

        // Create the img element and attach it to the div.
        const img = document.createElement("img");

        img.src = this.image;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.position = "absolute";
        this.div.appendChild(img);

        // Add the element to the "overlayLayer" pane.
        const panes = this.getPanes()!;

        panes.overlayLayer.appendChild(this.div);
    }

    draw() {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        const overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds.getSouthWest()
        )!;
        const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds.getNorthEast()
        )!;

        // Resize the image's div to fit the indicated dimensions.
        if (this.div) {
            this.div.style.left = sw.x + "px";
            this.div.style.top = ne.y + "px";
            this.div.style.width = ne.x - sw.x + "px";
            this.div.style.height = sw.y - ne.y + "px";
        }
    }

    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    onRemove() {
        if (this.div) {
            (this.div.parentNode as HTMLElement).removeChild(this.div);
            delete this.div;
        }
    }

    /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
    hide() {
        if (this.div) {
            this.div.style.visibility = "hidden";
        }
    }

    show() {
        if (this.div) {
            this.div.style.visibility = "visible";
        }
    }

    toggle() {
        if (this.div) {
            if (this.div.style.visibility === "hidden") {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    toggleDOM(map: google.maps.Map) {
        if (this.getMap()) {
            this.setMap(null);
        } else {
            this.setMap(map);
        }
    }
}

export default USGSOverlay;
