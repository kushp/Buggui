'use strict';

/**
 * A function that creates and returns the scene graph classes and constants.
 */
function createSceneGraphModule() {

    // Global Dimensions
    var carWidth = 25;
    var carHeight = 50;
    var axleWidth = 5;
    var axleHeight = 3;
    var tireWidth = 5;
    var tireHeight = 15;
    var bumperSize = 3;
    var rotatorSize = 8;

    // Part names. Use these to name your different nodes
    var CAR_PART = 'CAR_PART';
    var FRONT_LEFT_AXLE_PART = 'FRONT_LEFT_AXLE_PART';
    var FRONT_RIGHT_AXLE_PART = 'FRONT_RIGHT_AXLE_PART';
    var BACK_LEFT_AXLE_PART = 'BACK_LEFT_AXLE_PART';
    var BACK_RIGHT_AXLE_PART = 'BACK_RIGHT_AXLE_PART';
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';
    var TOP_BUMPER_PART = 'TOP_BUMPER_PART';
    var BOTTOM_BUMPER_PART = 'BOTTOM_BUMPER_PART';
    var LEFT_BUMPER_PART = 'LEFT_BUMPER_PART';
    var RIGHT_BUMPER_PART = 'RIGHT_BUMPER_PART';
    var FRONT_ROTATOR_PART = 'TOP_ROTATOR_PART';
    var BACK_ROTATOR_PART = 'BACK_ROTATOR_PART';

    var getCarWidth = function() {
        return carWidth;
    };

    var setCarWidth = function(newWidth) {
        carWidth = newWidth;
    };

    var getCarHeight = function() {
        return carHeight;
    };

    var setCarHeight = function(newHeight) {
        carHeight = newHeight;
    };

    var getAxleWidth = function() {
        return axleWidth;
    };

    var setAxleWidth = function(newWidth) {
        axleWidth = newWidth;
    };

    var GraphNode = function() {
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function(startPositionTransform, nodeName) {

            this.nodeName = nodeName;

            // The transform that will position this object, relative
            // to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform
            // has been applied
            this.objectTransform = new AffineTransform();

            // Any child nodes of this node
            this.children = {};

            // Add any other properties you need, here
        },

        addChild: function(graphNode) {
            this.children[graphNode.nodeName] = graphNode;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function(nodeName, newNode) {
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function(child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function(context) {
            // TODO: Should be overridden by subclass
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function(point) {
            // TODO: There are ways to handle this query here, but you may find it easier to handle in subclasses
        }

    });

    var CarNode = function() {
        this.initGraphNode(new AffineTransform(), CAR_PART);
    };

    _.extend(CarNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.m00_, this.startPositionTransform.m10_,
                this.startPositionTransform.m01_, this.startPositionTransform.m11_, this.startPositionTransform.m02_, this.startPositionTransform.m12_);
            context.transform(this.objectTransform.m00_, this.objectTransform.m10_, this.objectTransform.m01_,
                this.objectTransform.m11_, this.objectTransform.m02_, this.objectTransform.m12_);
            context.fillStyle = 'red';
            context.fillRect(-carWidth/2, -carHeight/2, carWidth, carHeight);
            _.each(this.children, function(child) {
                child.render(context);
            });
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            return point.x < carWidth/2 && point.x > -(carWidth/2) && point.y < carHeight/2 && point.y > -(carHeight/2);
        }
    });

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function(axlePartName) {
        if(axlePartName == BACK_RIGHT_AXLE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, (carWidth / 2) + (axleWidth / 2), (carHeight / 2) - 10), axlePartName);
        } else if(axlePartName == FRONT_RIGHT_AXLE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, (carWidth / 2) + (axleWidth / 2), -((carHeight / 2) - 10)), axlePartName);
        } else if(axlePartName == FRONT_LEFT_AXLE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, -((carWidth / 2) + (axleWidth / 2)), -((carHeight / 2) - 10)), axlePartName);
        } else if(axlePartName == BACK_LEFT_AXLE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, -((carWidth / 2) + (axleWidth / 2)), (carHeight / 2) - 10), axlePartName);
        }
        // TODO
    };

    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.m00_, this.startPositionTransform.m10_,
                this.startPositionTransform.m01_, this.startPositionTransform.m11_, this.startPositionTransform.m02_, this.startPositionTransform.m12_);
            context.transform(this.objectTransform.m00_, this.objectTransform.m10_, this.objectTransform.m01_,
                this.objectTransform.m11_, this.objectTransform.m02_, this.objectTransform.m12_);
            context.fillStyle = 'black';
            context.fillRect(-axleWidth/2, 0, axleWidth, axleHeight);
            _.each(this.children, function(child) {
                child.render(context);
            });
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            // User can't select axles
            return false;
        }
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function(tirePartName) {
        if(tirePartName == BACK_RIGHT_TIRE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, axleWidth/2, axleHeight/2), tirePartName);
        } else if(tirePartName == BACK_LEFT_TIRE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, -(axleWidth/2), axleHeight/2), tirePartName);
        } else if(tirePartName == FRONT_RIGHT_TIRE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, axleWidth/2, axleHeight/2), tirePartName);
        } else if(tirePartName == FRONT_LEFT_TIRE_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, -(axleWidth/2), axleHeight/2), tirePartName);
        }
        // TODO
    };

    _.extend(TireNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.m00_, this.startPositionTransform.m10_,
                this.startPositionTransform.m01_, this.startPositionTransform.m11_, this.startPositionTransform.m02_, this.startPositionTransform.m12_);
            context.transform(this.objectTransform.m00_, this.objectTransform.m10_, this.objectTransform.m01_,
                this.objectTransform.m11_, this.objectTransform.m02_, this.objectTransform.m12_);
            context.fillStyle = 'black';
            context.fillRect(-tireWidth/2, -tireHeight/2, tireWidth, tireHeight);
            _.each(this.children, function(child) {
                child.render(context);
            });
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            return point.x < tireWidth && point.x > -(tireWidth/2) && point.y < tireHeight && point.y > -(tireHeight/2);
        }
    });

    /**
     * @param bumperName Which bumper this node represents
     * @constructor
     */
    var BumperNode = function(bumperPartName) {
        if(bumperPartName == TOP_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, -(carHeight / 2)), bumperPartName);
        } else if(bumperPartName == BOTTOM_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, (carHeight / 2) - bumperSize), bumperPartName);
        } else if(bumperPartName == LEFT_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, -carWidth/2, -(carHeight / 2)), bumperPartName);
        } else if(bumperPartName == RIGHT_BUMPER_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, carWidth/2 - bumperSize, -(carHeight / 2)), bumperPartName);
        }
    };

    _.extend(BumperNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.m00_, this.startPositionTransform.m10_,
                this.startPositionTransform.m01_, this.startPositionTransform.m11_, this.startPositionTransform.m02_, this.startPositionTransform.m12_);
            context.transform(this.objectTransform.m00_, this.objectTransform.m10_, this.objectTransform.m01_,
                this.objectTransform.m11_, this.objectTransform.m02_, this.objectTransform.m12_);
            context.fillStyle = 'black';
            if(this.nodeName == LEFT_BUMPER_PART || this.nodeName == RIGHT_BUMPER_PART) {
                context.fillRect(0, 0, bumperSize, carHeight);
            } else {
                context.fillRect(-carWidth / 2, 0, carWidth, bumperSize);
            }
            _.each(this.children, function(child) {
                child.render(context);
            });
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            if(this.nodeName == LEFT_BUMPER_PART || this.nodeName == RIGHT_BUMPER_PART) {
                return point.x > - bumperSize && point.x < bumperSize && point.y < carHeight && point.y > 0;
            } else {
                return point.x < carWidth / 2 && point.x > -(carWidth / 2) && point.y < bumperSize && point.y > 0;
            }
        }
    });

    /**
     * @param roratorName Which rotator this node represents
     * @constructor
     */
    var RotatorNode = function(rotatorPartName) {
        if(rotatorPartName == FRONT_ROTATOR_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, -(carHeight / 2) + bumperSize), rotatorPartName);
        } else if(rotatorPartName == BACK_ROTATOR_PART) {
            this.initGraphNode(new AffineTransform(1, 0, 0, 1, 0, (carHeight / 2) - bumperSize - rotatorSize), rotatorPartName);
        }
    };

    _.extend(RotatorNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.m00_, this.startPositionTransform.m10_,
                this.startPositionTransform.m01_, this.startPositionTransform.m11_, this.startPositionTransform.m02_, this.startPositionTransform.m12_);
            context.transform(this.objectTransform.m00_, this.objectTransform.m10_, this.objectTransform.m01_,
                this.objectTransform.m11_, this.objectTransform.m02_, this.objectTransform.m12_);
            context.fillStyle = 'AliceBlue';
            context.fillRect(-carWidth/2, 0, carWidth, rotatorSize);
            _.each(this.children, function(child) {
                child.render(context);
            });
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            return point.x < carWidth/2 && point.x > -(carWidth/2) && point.y < rotatorSize && point.y > 0;
        }
    });

    // Return an object containing all of our classes and constants
    return {
        GraphNode: GraphNode,
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        BumperNode: BumperNode,
        RotatorNode: RotatorNode,
        CAR_PART: CAR_PART,
        getCarWidth: getCarWidth,
        setCarWidth: setCarWidth,
        getCarHeight: getCarHeight,
        setCarHeight: setCarHeight,
        getAxleWidth: getAxleWidth,
        setAxleWidth: setAxleWidth,
        FRONT_LEFT_AXLE_PART: FRONT_LEFT_AXLE_PART,
        FRONT_RIGHT_AXLE_PART: FRONT_RIGHT_AXLE_PART,
        BACK_LEFT_AXLE_PART: BACK_LEFT_AXLE_PART,
        BACK_RIGHT_AXLE_PART: BACK_RIGHT_AXLE_PART,
        FRONT_LEFT_TIRE_PART: FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART: BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART: BACK_RIGHT_TIRE_PART,
        TOP_BUMPER_PART: TOP_BUMPER_PART,
        BOTTOM_BUMPER_PART: BOTTOM_BUMPER_PART,
        LEFT_BUMPER_PART: LEFT_BUMPER_PART,
        RIGHT_BUMPER_PART: RIGHT_BUMPER_PART,
        FRONT_ROTATOR_PART: FRONT_ROTATOR_PART,
        BACK_ROTATOR_PART: BACK_ROTATOR_PART
    };
}