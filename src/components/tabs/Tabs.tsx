import { useState, Children } from "react";

import UlList from "../ui/ul-list/UlList";
import ListItem from "../ui/ul-list/list-item/ListItem";

interface ITabsProps {
    titles: string[];
    keys: string[];
    children: React.ReactNode;
}

import './Tabs.css';

function Tabs({ titles, keys, children }: ITabsProps) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTabIndex(index);
    };

    return (
        <>
            <UlList size="small" isWitoutPadding>
                {titles.map((title, index) => (
                    <ListItem key={title} isActive={index === activeTabIndex} isHorizontal>
                        <button className="page-change-button" onClick={() => handleTabClick(index)} type="button">
                            {title}
                        </button>
                    </ListItem>
                ))}
            </UlList>
            {Children.map(children, (child, index) => (
                <div className={`tab-content ${index === activeTabIndex ? '__visible' : '__hidden'}`} key={keys[index]}>
                    {child}
                </div>
            ))}
        </>
    );
}

export default Tabs;