'use strict';

import {Area} from '../../model/Area.js';
import {Areas} from '../../model/Areas.js';
import {Position} from '../../model/Position.js';
import {OSBotAreasConverter} from '../osbot/osbot_areas_converter.js';

export class DreamBotAreasConverter extends OSBotAreasConverter {
    
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Tile";
    }
    
    /*
    API Doc:
        https://dreambot.org/javadocs/org/dreambot/api/methods/map/Area.html
        https://dreambot.org/javadocs/org/dreambot/api/methods/map/Tile.html

    Area(int x1, int y1, int x2, int y2)
    Area(int x1, int y1, int x2, int y2, int z)
    Area(Tile ne, Tile sw)
    
    Tile(int x, int y) 
    Tile(int x, int y, int z)
    */
    fromJava(text, areas) {        
        areas.removeAll();
        text = text.replace(/\s/g, '');
        
        var areasPattern = ``
        
        var areasPattern = `(?:new${this.javaArea}\\((\\d+,\\d+,\\d+,\\d+(?:,\\d+)?)\\)|\\(new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\),new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)\\))`;
        var re = new RegExp(areasPattern,"mg");
        var match;
        while ((match = re.exec(text))) {
            if (match[1] !== undefined) {
                var values = match[1].split(",");
                var z = values.length == 4 ? 0 : values[4];
                areas.add(new Area(new Position(values[0], values[1], z), new Position(values[2], values[3], z)));
            } else {
                var pos1Values = match[2].split(",");
                var pos1Z = pos1Values.length == 2 ? 0 : pos1Values[2];

                var pos2Values = match[3].split(",");
                var pos2Z = pos2Values.length == 2 ? 0 : pos2Values[2];
                
                areas.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Z), new Position(pos2Values[0], pos2Values[1], pos2Z)));
            }
        }
    }
    
    toJavaSingle(area) {
        if (area.startPosition.z == 0) {
            return `new ${this.javaArea}(new Tile(${area.startPosition.x}, ${area.startPosition.y}, ${area.startPosition.z}), new Tile(${area.endPosition.x}, ${area.endPosition.y}, ${area.endPosition.z}))`;
        }
        return `new ${this.javaArea}(new Tile(${area.startPosition.x}, ${area.startPosition.y}, ${area.startPosition.z}), new Tile(${area.endPosition.x}, ${area.endPosition.y}, ${area.endPosition.z}))`;
    }
}