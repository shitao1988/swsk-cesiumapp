import React from 'react';
import MapGL from "react-map-gl";
const axios = require('axios');

const MAPBOX_TOKEN =
    "pk.eyJ1Ijoic2hpdGFvMTk4OCIsImEiOiJjaWc3eDJ2eHowMjA5dGpsdzZlcG5uNWQ5In0.nQQjb4DrqnZtY68rOQIjJA"; // Set your mapbox token here

import { defaultMapStyle } from '../../components/MapBoxGL/mapstyle';

class ShowMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map3d: {
                mapstyle: defaultMapStyle
            },
            showmap:false
        };
    }

    UNSAFE_componentWillMount() {
        this.init();
    }

    componentDidMount() {
        if (!this.props.serverinfo) {
            return;
        }
        const serverinfo = this.props.serverinfo;
        const layerprop = {
            serviceType: serverinfo.typename,
            name: serverinfo.serviceInfor.name,
            proxy_url: serverinfo.serviceInfor.proxy_url,

        }
        
        this.addThematicToStyle(layerprop);
    }
    _onViewportChange = viewport => {
        this.setState({ map3d:{...this.state.map3d,...viewport} });
    };

    init = async () => {
        let config = await this.getconfig();
        await this.setState({
            map3d: { ...this.state.map3d, ...config.data.map3d.viewport }
        })
    }

    getconfig = () => {
        return axios.get("config.json");
    }

    addSourceAndLayers = async (sourcename, source, layers) => {
        this.setState({
            showmap:true
        })
        let sources = this.state.map3d.mapstyle.sources;
        sources[layers.source] = source;
        await this.setState({
            map3d: {
                ...this.state.map3d,
                mapstyle: {
                    ...this.state.map3d.mapstyle, sources: {...sources}, layers:this.state.map3d.mapstyle.layers.concat(layers)
                }
            }
        })
        console.log(this.state)
    }

    addThematicToStyle = (item) => {
        if (item.serviceType === 'wms') {
            this.addSourceAndLayers('thematic_' + item.name,
                {
                    'type': 'raster',
                    'tiles': [
                        ServerIp + item.proxy_url + "?bbox={bbox-epsg-4490}&format=image/png&service=WMS&version=1.1.1&request=GetMap&styles=default&srs=EPSG:4490&transparent=true&width=256&height=256&layers=0"
                    ],
                    'tileSize': 256
                }, {
                "id": 'thematic_' + item.name,
                "type": "raster",
                "visibility": "none",
                "source": 'thematic_' + item.name,
            }
            )
        } else if (item.serviceType === 'wmts') {
            this.addSourceAndLayers('thematic_' + item.name,
                {
                    'type': 'raster',
                    'tiles': [
                        ServerIp + item.proxy_url + "?request=GetTile&tilematrix={z}&tilerow={y}&tilecol={x}"
                    ],
                    'tileSize': 256
                }, {
                "id": 'thematic_' + item.name,
                "type": "raster",
                "visibility": "none",
                "source": 'thematic_' + item.name,
            }
            )
        }
    }

    render() {
        return <div style={{ height: "500px", width: "100%" }}>
            <MapGL
                {...this.state.map3d}
                width="100%"
                height="100%"
                ref={map => (this.mapRef = map)}
                mapStyle={this.state.map3d.mapstyle}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                onViewportChange={this._onViewportChange}
            >
                {this.state.showmap?null
                    :<div style={{background: '#ccc',width: '250px',textAlign: 'center',
                        fontSize: '16px',fontWeight: '700',position: 'relative',top: '50px',left: '30%'}}>
                            <span>该服务类型暂不支持预览</span>
                    </div>}
            </MapGL>
        </div>

    }
}
export default ShowMap;