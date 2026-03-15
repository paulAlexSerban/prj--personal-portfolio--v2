
import { base } from "@/styles/templates/generic.module.scss";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/core/library/organisms/Header.organism"));
const Main = dynamic(() => import("@/core/library/organisms/Main.organism"));
const Footer = dynamic(() => import("@/core/library/organisms/Footer.organism"));

function GenericTemplate({ children }) {
    return (
        <div className={base}>
            <Header />
            <Main>{children}</Main>
            <Footer />
        </div>
    );
}

export default GenericTemplate;
