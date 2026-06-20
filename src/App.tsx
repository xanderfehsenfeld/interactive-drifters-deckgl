// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Map, NavigationControl, useControl } from "react-map-gl/maplibre";
import { GeoJsonLayer, ArcLayer } from "deck.gl";
import {
  MapboxOverlay as DeckOverlay,
  type MapboxOverlayProps,
} from "@deck.gl/mapbox";
import "maplibre-gl/dist/maplibre-gl.css";
import { fetchPoints, type IPoints } from "./data/fetchData";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const initialZoomLevel = 8;
const initialLat = 48;
const initialLong = -123;

const INITIAL_VIEW_STATE = {
  latitude: initialLat,
  longitude: initialLong,
  zoom: initialZoomLevel,
  bearing: 0,
  pitch: 30,
  minZoom: 7,
  maxZoom: 15,
};

const MAP_STYLE = "/alidade_smooth_light.json";

const DeckGLOverlay = (props: MapboxOverlayProps) => {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
};

function Root() {
  const [data, setData] = useState<IPoints | null>(null);

  useEffect(() => {
    fetchPoints("PS_tracks.json").then((points) => {
      setData(points);
    });
  }, []);

  const layers = [
    new GeoJsonLayer({
      id: "airports",
      data: data as IPoints,
      // Styles
      filled: true,
      // pointRadiusMinPixels: 10,
      // pointRadiusMaxPixels: 2,
      pointRadiusScale: 2,
      pointRadiusUnits: "meters",

      getPointRadius: () => 500,

      pointAntialiasing: true,

      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      // onClick: (info) => setSelected(info.object),
      // beforeId: 'watername_ocean' // In interleaved mode, render the layer under map labels
    }),
    new ArcLayer({
      id: "arcs",
      data: AIR_PORTS,
      dataTransform: (d: any) =>
        d.features.filter((f: any) => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: () => [-0.4531566, 51.4709959], // London
      getTargetPosition: (f) => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1,
    }),
  ];

  return (
    <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
      <DeckGLOverlay layers={layers} /* interleaved*/ />
      <NavigationControl position="top-left" />

      <NavigationControl position="bottom-right" />
    </Map>
  );
}

/* global document */
const container = document.body.appendChild(document.createElement("div"));
createRoot(container).render(<Root />);
