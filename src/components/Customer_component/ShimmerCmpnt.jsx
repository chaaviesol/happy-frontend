import React from "react";
import { ShimmerContentBlock } from "react-shimmer-effects-18";
import "../Customer_component/Side_product_listing.css"

export default function ShimmerCmpnt() {
  return (
    <>
      <div style={{ height: "20px" }}></div>
      <div id="mediaDisplaynone" className="row" style={{ margin: "00px 00px 00px 10px" }}>
        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>
        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>
        <div style={{ height: "320px" }}></div>
        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>
        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>{" "}
        <div style={{ height: "320px" }}></div>

        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>{" "}
        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>{" "}
        <div style={{ height: "320px" }}></div>
        <div className="col-sm-6">
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={200}
            thumbnailHeight={370}
          />
        </div>
      </div>

      <></>
    </>
  );
}
