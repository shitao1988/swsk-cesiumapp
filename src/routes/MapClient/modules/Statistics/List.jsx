import React, { Component } from "react";
import { List, Card, Icon } from "antd";
import  './style.less';
import tpng from '../../components/MapBoxGL/assest/Zfu64OCo.png';

const data = [
  {
    title: "Title 1"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  },
  {
    title: "Title 2"
  },
  {
    title: "Title 3"
  },
  {
    title: "Title 4"
  }
];

export default class StatisticList extends Component {
  render() {
    return (
      <>
        <List
          className='StatisticList'
          grid={{ gutter: 16, column: 2 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card
                style={{ width: 130 }}
                cover={
                  <img
                    alt="example"
                    src={tpng}
                  />
                }
                actions={[
                  <Icon type="setting" key="setting" />,
                  <Icon type="edit" key="edit" />,
                  <Icon type="ellipsis" key="ellipsis" />
                ]}
              >
                <Card.Meta
                  title="Card title"
                />
              </Card>
            </List.Item>
          )}
        />
      </>
    );
  }
}
