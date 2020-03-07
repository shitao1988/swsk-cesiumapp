/*
 * @Author: 史涛 
 * @Date: 2019-10-24 22:56:07 
 * @Last Modified by:   史涛 
 * @Last Modified time: 2019-10-24 22:56:07 
 */
import React from 'react';
import { Button } from 'antd';

export const isImg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/;
export const getChildrenToRender = (item, i) => {
  const tag = item.name.indexOf('title') === 0 ? 'h1' : 'div';
  let children = typeof item.children === 'string' && item.children.match(isImg)||item.name==="image"
    ? React.createElement('img', { src: item.children, alt: 'img' })
    : item.name.indexOf('title')===-1? React.createElement('span',{style:{display:'block'}},item.children)
    : item.children;
  if (item.name.indexOf('button') === 0 && typeof item.children === 'object') {
    children = React.createElement(Button, {
      ...item.children
    });
  }
  return React.createElement(tag, { key: i.toString(), ...item }, children);
};