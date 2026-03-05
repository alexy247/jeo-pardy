import { Fragment } from "react/jsx-runtime";
import { useGameStore } from "../../store/useGameStore";
import { Outlet } from "react-router-dom";

import CenteringBlock from "../ui/centering-block/CenteringBlock";

const ConectionLayout = () => {
    const { isLoading } = useGameStore();

    // Есть ощущение что никогда не работает
    return (
        <Fragment>
            {isLoading ?? <CenteringBlock>Loading...</CenteringBlock>}
            <Outlet />
        </Fragment>
    );
};

export default ConectionLayout;