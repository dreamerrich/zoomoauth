import React from "react";
import Image from "../components/elements/Image";

function Avtar() {
  return (
    <div>
      <Image
        src={require('./../assets/images/user.jpg')}
        width={200}
        height={200}
      />
    </div>
  );
}

export default Avtar;