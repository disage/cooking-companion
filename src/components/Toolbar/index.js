import React from "react";

import './index.css'
import useTime from '../../helpers/timeUtils'

const Toolbar = ({ options, onAdd, onClear }) => {
    const { currentTime, mealTime } = useTime();

    return (
        <div className={`toolbar ${options.length === 2 ? 'flexStart' : 'flexSpaceBetween'}`}>
            {options.includes('time') && <b className="toolbarItem">{currentTime}</b>}
            {options.includes('type') && <div className="toolbarItem">{mealTime}</div>}
            {
                options.includes('persons') &&
                <div className="toolbarItem toolbarAction">1
                    <svg className="personIcon" width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5.81004" cy="3.3637" r="3.3637" fill="#332D46" />
                        <path d="M11.6201 12.8432C11.6201 14.701 9.01882 14.0664 5.81003 14.0664C2.60124 14.0664 0 14.701 0 12.8432C0 10.9855 2.60124 6.72742 5.81003 6.72742C9.01882 6.72742 11.6201 10.9855 11.6201 12.8432Z" fill="#332D46" />
                    </svg>
                    <svg className="arrowBottomIcon" width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7.5 9L14 1" stroke="#332D46" stroke-width="2" />
                    </svg>
                </div>
            }
            {options.includes('add') && <div className="toolbarItem toolbarAction" onClick={onAdd}>Add</div>}
            {options.includes('clear') && <div className="toolbarItem toolbarAction" onClick={onClear}>Clear All</div>}
            {options.includes('share') && <div className="toolbarItem toolbarAction shareAction">Share</div>}
        </div>
    );
}

export default Toolbar;