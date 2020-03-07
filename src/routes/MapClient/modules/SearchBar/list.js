/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:29:47 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-01-08 15:18:33
 */
import React from 'react';

const List = (props) => {

    const list = props.listItems.result && props.listItems.result.map((el, i) => (
        <div className="text item" key={i}><span
            style={
                el.done
                    ? { textDecoration: 'line-through', fontSize: '20px' }
                    : { textDecoration: 'none', fontSize: '20px' }
            }
        >
            {el.properties.NAME} </span>
        </div>
    ));

    return (
        <div style={props.listItems.result ? { "height": "calc(100vh - 200px)", "overflowY": "auto" } : {
            "height": "calc(100vh - 200px)", "overflowY": "auto", "display": "none"
        }}>
            {list}

        </div>
    )
};

export default List;
