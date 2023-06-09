import LayoutClient from "../../components/LayoutClient";
import Carousel from "../../components/client/Carousel";

function Homepage() {
  return (
    <LayoutClient>
      <div className="page__container_fluid overflow-hidden">
        <Carousel />
      </div>
    </LayoutClient>
  );
}

export default Homepage;
