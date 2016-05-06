'use strict';

// This should be your main point of entry for your app

// Snipplet from online
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

window.addEventListener('load', function() {
    var sceneGraphModule = createSceneGraphModule();
    var appContainer = document.getElementById('app-container');
    var appCanvas = document.getElementById('app-canvas');
    var ctx = appCanvas.getContext('2d');
    var originalPoint; // Used for drags
    var isAxleScaleLeft = false;
    var isAxleScaleRight = false;
    var isScaleV = false; // True if scaling vertically, false if not.
    var isScaleTop = false; // True if scaling by using top bumper, false if not.
    var isScaleLeft = false;
    var isScaleRight = false;
    var isTranslate = false; // True if translating, false if not.

    var carNode = new sceneGraphModule.CarNode();
    var topBumperNode = new sceneGraphModule.BumperNode(sceneGraphModule.TOP_BUMPER_PART);
    var bottomBumperNode = new sceneGraphModule.BumperNode(sceneGraphModule.BOTTOM_BUMPER_PART);
    var leftBumperNode = new sceneGraphModule.BumperNode(sceneGraphModule.LEFT_BUMPER_PART);
    var rightBumperNode = new sceneGraphModule.BumperNode(sceneGraphModule.RIGHT_BUMPER_PART);
    var backRightAxleNode = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_RIGHT_AXLE_PART);
    var backRightTireNode = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
    var backLeftAxleNode = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_LEFT_AXLE_PART);
    var backLeftTireNode = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
    var frontRightAxleNode = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_RIGHT_AXLE_PART);
    var frontRightTireNode = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
    var frontLeftAxleNode = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_LEFT_AXLE_PART);
    var frontLeftTireNode = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
    var frontRotatorNode = new sceneGraphModule.RotatorNode(sceneGraphModule.FRONT_ROTATOR_PART);
    var backRotatorNode = new sceneGraphModule.RotatorNode(sceneGraphModule.BACK_ROTATOR_PART);
    backRightAxleNode.addChild(backRightTireNode);
    backLeftAxleNode.addChild(backLeftTireNode);
    frontRightAxleNode.addChild(frontRightTireNode);
    frontLeftAxleNode.addChild(frontLeftTireNode);
    carNode.addChild(frontLeftAxleNode);
    carNode.addChild(backRightAxleNode);
    carNode.addChild(backLeftAxleNode);
    carNode.addChild(frontRightAxleNode);
    carNode.addChild(frontRotatorNode);
    carNode.addChild(backRotatorNode);
    carNode.addChild(leftBumperNode);
    carNode.addChild(rightBumperNode);
    carNode.addChild(topBumperNode);
    carNode.addChild(bottomBumperNode);
    carNode.objectTransform.preTranslate(400, 300); // Do initial translate to centre
    carNode.render(ctx);


    var mouseDragScaleVertical = function(event) {
        var newPos = getMousePos(appCanvas, event);
        var newHeight;
        if(isScaleTop) {
            newHeight = sceneGraphModule.getCarHeight() - (newPos.y - originalPoint.y);
        } else {
            newHeight = sceneGraphModule.getCarHeight() + (newPos.y - originalPoint.y);
        }
        if(newHeight < 50) {
            newHeight = 50;
        } else if(newHeight > 200) {
            newHeight = 200;
        }
        sceneGraphModule.setCarHeight(newHeight);
        originalPoint = newPos;

        // We have to fix some things (ALL THE SPT's)
        topBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, -(sceneGraphModule.getCarHeight() / 2));
        bottomBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, (sceneGraphModule.getCarHeight() / 2) - 3); // Bumper size will always be 3
        backRightAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, (sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2), (sceneGraphModule.getCarHeight() / 2) - 10);
        frontRightAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, (sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2), -((sceneGraphModule.getCarHeight() / 2) - 10));
        backLeftAxleNode.startPositionTransform =  new AffineTransform(1, 0, 0, 1, -((sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2)), (sceneGraphModule.getCarHeight() / 2) - 10);
        frontLeftAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -((sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2)), -((sceneGraphModule.getCarHeight() / 2) - 10));
        frontRotatorNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, -(sceneGraphModule.getCarHeight() / 2) + 3);
        backRotatorNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, (sceneGraphModule.getCarHeight() / 2) - 3 - 8); // Bumper size will always be 3 and rotator size will always be 8
        leftBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -sceneGraphModule.getCarWidth()/2, -(sceneGraphModule.getCarHeight() / 2))
        rightBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, sceneGraphModule.getCarWidth()/2 - 3, -(sceneGraphModule.getCarHeight() / 2));

        ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
        carNode.render(ctx);
    };

    var mouseDragScaleHorizontal = function(event) {
        var newPos = getMousePos(appCanvas, event);
        var newWidth;
        if(isScaleLeft) {
            newWidth = sceneGraphModule.getCarWidth() - (newPos.x - originalPoint.x);
        } else {
            newWidth = sceneGraphModule.getCarWidth() + (newPos.x - originalPoint.x);
        }
        if(newWidth < 25) {
            newWidth = 25;
        } else if(newWidth > 150) {
            newWidth = 150;
        }
        sceneGraphModule.setCarWidth(newWidth);
        originalPoint = newPos;

        // We have to fix some things (ALL THE SPT's)
        topBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, -(sceneGraphModule.getCarHeight() / 2));
        bottomBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, (sceneGraphModule.getCarHeight() / 2) - 3); // Bumper size will always be 3
        backRightAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, (sceneGraphModule.getCarWidth() / 2) +
                                                    (sceneGraphModule.getAxleWidth() / 2), (sceneGraphModule.getCarHeight() / 2) - 10);
        frontRightAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, (sceneGraphModule.getCarWidth() / 2) +
                                                    (sceneGraphModule.getAxleWidth() / 2), -((sceneGraphModule.getCarHeight() / 2) - 10));
        backLeftAxleNode.startPositionTransform =  new AffineTransform(1, 0, 0, 1, -((sceneGraphModule.getCarWidth() / 2) +
                                                    (sceneGraphModule.getAxleWidth() / 2)), (sceneGraphModule.getCarHeight() / 2) - 10);
        frontLeftAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -((sceneGraphModule.getCarWidth() / 2) +
                                                    (sceneGraphModule.getAxleWidth() / 2)), -((sceneGraphModule.getCarHeight() / 2) - 10));
        frontRotatorNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, -(sceneGraphModule.getCarHeight() / 2) + 3);
        backRotatorNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, 0, (sceneGraphModule.getCarHeight() / 2) - 3 - 8); // Bumper size will always be 3 and rotator size will always be 8
        leftBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -sceneGraphModule.getCarWidth()/2, -(sceneGraphModule.getCarHeight() / 2))
        rightBumperNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, sceneGraphModule.getCarWidth()/2 - 3, -(sceneGraphModule.getCarHeight() / 2));

        ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
        carNode.render(ctx);
    };

    var mouseDragScaleAxles = function(event) {
        var newPos = getMousePos(appCanvas, event);
        var newWidth;
        if(isAxleScaleLeft) {
            newWidth = sceneGraphModule.getAxleWidth() - (newPos.x - originalPoint.x);
        } else {
            newWidth = sceneGraphModule.getAxleWidth() + (newPos.x - originalPoint.x);
        }
        if(newWidth < 5) {
            newWidth = 5;
        } else if(newWidth > 75) {
            newWidth = 75;
        }
        sceneGraphModule.setAxleWidth(newWidth);
        originalPoint = newPos;

        // Have to fix these
        backRightAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, (sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2), (sceneGraphModule.getCarHeight() / 2) - 10);
        frontRightAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, (sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2), -((sceneGraphModule.getCarHeight() / 2) - 10));
        backLeftAxleNode.startPositionTransform =  new AffineTransform(1, 0, 0, 1, -((sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2)), (sceneGraphModule.getCarHeight() / 2) - 10);
        frontLeftAxleNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -((sceneGraphModule.getCarWidth() / 2) +
        (sceneGraphModule.getAxleWidth() / 2)), -((sceneGraphModule.getCarHeight() / 2) - 10));
        backRightTireNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, sceneGraphModule.getAxleWidth()/2, 3/2); // AxleHeight is constant 3
        frontRightTireNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, sceneGraphModule.getAxleWidth()/2, 3/2);
        backLeftTireNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -(sceneGraphModule.getAxleWidth()/2), 3/2);
        frontLeftTireNode.startPositionTransform = new AffineTransform(1, 0, 0, 1, -(sceneGraphModule.getAxleWidth()/2), 3/2);

        ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
        carNode.render(ctx);
    };

    var mouseDragRotateCar = function(event) {
        var newPos = getMousePos(appCanvas, event);
        if(newPos.y != originalPoint.y && newPos.x != originalPoint.x) {
            var angle = Math.atan2(newPos.y - originalPoint.y, newPos.x - originalPoint.x);

            originalPoint = newPos;

            carNode.objectTransform.rotate(angle, 0, 0);

            ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
            carNode.render(ctx);
        }
    };

    var mouseDragTrans = function(event) {
        var newPos = getMousePos(appCanvas, event);
        carNode.objectTransform.preTranslate(newPos.x - originalPoint.x, newPos.y - originalPoint.y);
        originalPoint = newPos;
        ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
        carNode.render(ctx);
    };

    appCanvas.addEventListener('mousemove', function(event) {
        if(isScaleV || isTranslate || isScaleLeft || isScaleRight || isAxleScaleLeft || isAxleScaleRight) {
            return;
        }
        var pos = getMousePos(appCanvas, event);
        var src = [pos.x, pos.y];
        var destTopBumper = [];
        var destLeftBumper = [];
        var destBottomBumper = [];
        var destRightBumper = [];
        var destCar = [];
        var destTopRotator = [];
        var destBottomRotator = [];
        var destFrontLeftTire = [];
        var destBackLeftTire = [];
        var destFrontRightTire = [];
        var destBackRightTire = [];
        var carNodeInverse = carNode.objectTransform.createInverse().concatenate(carNode.startPositionTransform.createInverse());
        var topBumperInverse = carNodeInverse.clone().concatenate(topBumperNode.startPositionTransform.createInverse().concatenate(topBumperNode.objectTransform.createInverse()));
        var leftBumperInverse = carNodeInverse.clone().concatenate(leftBumperNode.startPositionTransform.createInverse().concatenate(leftBumperNode.objectTransform.createInverse()));
        var rightBumperInverse = carNodeInverse.clone().concatenate(rightBumperNode.startPositionTransform.createInverse().concatenate(rightBumperNode.objectTransform.createInverse()));
        var bottomBumperInverse = carNodeInverse.clone().concatenate(bottomBumperNode.startPositionTransform.createInverse().concatenate(bottomBumperNode.objectTransform.createInverse()));
        var topRotatorInverse = carNodeInverse.clone().concatenate(frontRotatorNode.startPositionTransform.createInverse().concatenate(frontRotatorNode.objectTransform.createInverse()));
        var bottomRotatorInverse = carNodeInverse.clone().concatenate(backRotatorNode.startPositionTransform.createInverse().concatenate(backRotatorNode.objectTransform.createInverse()));
        var frontLeftTireInverse = carNodeInverse.clone().concatenate(frontLeftAxleNode.startPositionTransform.createInverse().concatenate(frontLeftAxleNode.objectTransform.createInverse())
            .concatenate(frontLeftTireNode.startPositionTransform.createInverse()).concatenate(frontLeftTireNode.objectTransform.createInverse()));
        var backLeftTireInverse = carNodeInverse.clone().concatenate(backLeftAxleNode.startPositionTransform.createInverse().concatenate(backLeftAxleNode.objectTransform.createInverse())
            .concatenate(frontLeftTireNode.startPositionTransform.createInverse()).concatenate(backLeftTireNode.objectTransform.createInverse()));
        var frontRightTireInverse = carNodeInverse.clone().concatenate(frontRightAxleNode.startPositionTransform.createInverse().concatenate(frontRightAxleNode.objectTransform.createInverse())
            .concatenate(frontRightTireNode.startPositionTransform.createInverse()).concatenate(frontRightTireNode.objectTransform.createInverse()));
        var backRightTireInverse = carNodeInverse.clone().concatenate(backRightAxleNode.startPositionTransform.createInverse().concatenate(backRightAxleNode.objectTransform.createInverse())
            .concatenate(backRightTireNode.startPositionTransform.createInverse()).concatenate(backRightTireNode.objectTransform.createInverse()));

        topBumperInverse.transform(src, 0, destTopBumper, 0, 1);
        leftBumperInverse.transform(src, 0, destLeftBumper, 0, 1);
        bottomBumperInverse.transform(src, 0, destBottomBumper, 0, 1);
        carNodeInverse.transform(src, 0, destCar, 0, 1);
        topRotatorInverse.transform(src, 0, destTopRotator, 0, 1);
        bottomRotatorInverse.transform(src, 0, destBottomRotator, 0, 1);
        rightBumperInverse.transform(src, 0, destRightBumper, 0, 1);
        frontLeftTireInverse.transform(src, 0, destFrontLeftTire, 0, 1);
        backLeftTireInverse.transform(src, 0, destBackLeftTire, 0, 1);
        frontRightTireInverse.transform(src, 0, destFrontRightTire, 0, 1);
        backRightTireInverse.transform(src, 0, destBackRightTire, 0, 1);

        if(topBumperNode.pointInObject({x: destTopBumper[0], y: destTopBumper[1]}) || bottomBumperNode.pointInObject({x: destBottomBumper[0], y: destBottomBumper[1]})) {
            appCanvas.style.cursor = 'n-resize';
        } else if(leftBumperNode.pointInObject({x: destLeftBumper[0], y: destLeftBumper[1]}) || rightBumperNode.pointInObject({x: destRightBumper[0], y: destRightBumper[1]})) {
            appCanvas.style.cursor = 'e-resize';
        } else if(frontLeftTireNode.pointInObject({x: destFrontLeftTire[0], y: destFrontLeftTire[1]}) ||
                    backLeftTireNode.pointInObject({x: destBackLeftTire[0], y: destBackLeftTire[1]}) ||
                    frontRightTireNode.pointInObject({x: destFrontRightTire[0], y: destFrontRightTire[1]}) ||
                    backRightTireNode.pointInObject({x: destBackRightTire[0], y: destBackRightTire[1]})) {
            appCanvas.style.cursor = 'e-resize';
        } else if(carNode.pointInObject({x: destCar[0], y: destCar[1]})) {
            appCanvas.style.cursor = 'pointer';
        } else {
            appCanvas.style.cursor = 'default';
        }
    });

    appCanvas.addEventListener('mousedown', function(event) {
        var pos = getMousePos(appCanvas, event);
        var src = [pos.x, pos.y];
        var destTopBumper = [];
        var destLeftBumper = [];
        var destBottomBumper = [];
        var destRightBumper = [];
        var destCar = [];
        var destTopRotator = [];
        var destBottomRotator = [];
        var destFrontLeftTire = [];
        var destBackLeftTire = [];
        var destFrontRightTire = [];
        var destBackRightTire = [];
        var carNodeInverse = carNode.objectTransform.createInverse().concatenate(carNode.startPositionTransform.createInverse());
        var topBumperInverse = carNodeInverse.clone().concatenate(topBumperNode.startPositionTransform.createInverse().concatenate(topBumperNode.objectTransform.createInverse()));
        var leftBumperInverse = carNodeInverse.clone().concatenate(leftBumperNode.startPositionTransform.createInverse().concatenate(leftBumperNode.objectTransform.createInverse()));
        var rightBumperInverse = carNodeInverse.clone().concatenate(rightBumperNode.startPositionTransform.createInverse().concatenate(rightBumperNode.objectTransform.createInverse()));
        var bottomBumperInverse = carNodeInverse.clone().concatenate(bottomBumperNode.startPositionTransform.createInverse().concatenate(bottomBumperNode.objectTransform.createInverse()));
        var topRotatorInverse = carNodeInverse.clone().concatenate(frontRotatorNode.startPositionTransform.createInverse().concatenate(frontRotatorNode.objectTransform.createInverse()));
        var bottomRotatorInverse = carNodeInverse.clone().concatenate(backRotatorNode.startPositionTransform.createInverse().concatenate(backRotatorNode.objectTransform.createInverse()));
        var frontLeftTireInverse = carNodeInverse.clone().concatenate(frontLeftAxleNode.startPositionTransform.createInverse().concatenate(frontLeftAxleNode.objectTransform.createInverse())
            .concatenate(frontLeftTireNode.startPositionTransform.createInverse()).concatenate(frontLeftTireNode.objectTransform.createInverse()));
        var backLeftTireInverse = carNodeInverse.clone().concatenate(backLeftAxleNode.startPositionTransform.createInverse().concatenate(backLeftAxleNode.objectTransform.createInverse())
            .concatenate(frontLeftTireNode.startPositionTransform.createInverse()).concatenate(backLeftTireNode.objectTransform.createInverse()));
        var frontRightTireInverse = carNodeInverse.clone().concatenate(frontRightAxleNode.startPositionTransform.createInverse().concatenate(frontRightAxleNode.objectTransform.createInverse())
            .concatenate(frontRightTireNode.startPositionTransform.createInverse()).concatenate(frontRightTireNode.objectTransform.createInverse()));
        var backRightTireInverse = carNodeInverse.clone().concatenate(backRightAxleNode.startPositionTransform.createInverse().concatenate(backRightAxleNode.objectTransform.createInverse())
            .concatenate(backRightTireNode.startPositionTransform.createInverse()).concatenate(backRightTireNode.objectTransform.createInverse()));

        topBumperInverse.transform(src, 0, destTopBumper, 0, 1);
        leftBumperInverse.transform(src, 0, destLeftBumper, 0, 1);
        bottomBumperInverse.transform(src, 0, destBottomBumper, 0, 1);
        carNodeInverse.transform(src, 0, destCar, 0, 1);
        topRotatorInverse.transform(src, 0, destTopRotator, 0, 1);
        bottomRotatorInverse.transform(src, 0, destBottomRotator, 0, 1);
        rightBumperInverse.transform(src, 0, destRightBumper, 0, 1);
        frontLeftTireInverse.transform(src, 0, destFrontLeftTire, 0, 1);
        backLeftTireInverse.transform(src, 0, destBackLeftTire, 0, 1);
        frontRightTireInverse.transform(src, 0, destFrontRightTire, 0, 1);
        backRightTireInverse.transform(src, 0, destBackRightTire, 0, 1);

        if(topBumperNode.pointInObject({x: destTopBumper[0], y: destTopBumper[1]})) {
            isScaleV = true;
            isScaleTop = true;
            originalPoint = pos;
            appCanvas.style.cursor = 'n-resize';
            appCanvas.addEventListener('mousemove', mouseDragScaleVertical);
        } else if(bottomBumperNode.pointInObject({x: destBottomBumper[0], y: destBottomBumper[1]})) {
            isScaleV = true;
            isScaleTop = false;
            originalPoint = pos;
            appCanvas.style.cursor = 'n-resize';
            appCanvas.addEventListener('mousemove', mouseDragScaleVertical);
        } else if(leftBumperNode.pointInObject({x: destLeftBumper[0], y: destLeftBumper[1]})) {
            isScaleV = false;
            isScaleLeft = true;
            originalPoint = pos;
            appCanvas.style.cursor = 'e-resize';
            appCanvas.addEventListener('mousemove', mouseDragScaleHorizontal);
        } else if(rightBumperNode.pointInObject({x: destRightBumper[0], y: destRightBumper[1]})) {
            isScaleV = false;
            isScaleLeft = false;
            isScaleRight = true;
            originalPoint = pos;
            appCanvas.style.cursor = 'e-resize';
            appCanvas.addEventListener('mousemove', mouseDragScaleHorizontal);
        } else if(frontRotatorNode.pointInObject({x: destTopRotator[0], y: destTopRotator[1]})) {
            originalPoint = pos;
            appCanvas.addEventListener('mousemove', mouseDragRotateCar);
        } else if(frontLeftTireNode.pointInObject({x: destFrontLeftTire[0], y: destFrontLeftTire[1]}) ||
                    backLeftTireNode.pointInObject({x: destBackLeftTire[0], y: destBackLeftTire[1]})) {
            originalPoint = pos;
            isAxleScaleLeft = true;
            appCanvas.addEventListener('mousemove', mouseDragScaleAxles);
        } else if(frontRightTireNode.pointInObject({x: destFrontRightTire[0], y: destFrontRightTire[1]}) ||
            backRightTireNode.pointInObject({x: destBackRightTire[0], y: destBackRightTire[1]})) {
            originalPoint = pos;
            isAxleScaleRight = true;
            isAxleScaleLeft = false;
            appCanvas.addEventListener('mousemove', mouseDragScaleAxles);
        } else if(carNode.pointInObject({x: destCar[0], y: destCar[1]})) {
            isTranslate = true;
            originalPoint = pos;
            appCanvas.style.cursor = 'pointer';
            appCanvas.addEventListener('mousemove', mouseDragTrans);
        }
    });

    appCanvas.addEventListener('mouseup', function(event) {
        isScaleV = false;
        isScaleTop = false;
        isScaleLeft = false;
        isScaleRight = false;
        isAxleScaleLeft = false;
        isAxleScaleRight = false;
        isTranslate = false;
        appCanvas.style.cursor = 'default';
        appCanvas.removeEventListener('mousemove', mouseDragScaleVertical);
        appCanvas.removeEventListener('mousemove', mouseDragScaleHorizontal);
        appCanvas.removeEventListener('mousemove', mouseDragScaleAxles);
        appCanvas.removeEventListener('mousemove', mouseDragTrans);
        appCanvas.removeEventListener('mousemove', mouseDragRotateCar);
    });

    appCanvas.addEventListener('mouseout', function(event) {
        isScaleV = false;
        isScaleTop = false;
        isScaleLeft = false;
        isScaleRight = false;
        isAxleScaleLeft = false;
        isAxleScaleRight = false;
        isTranslate = false;
        appCanvas.style.cursor = 'default';
        appCanvas.removeEventListener('mousemove', mouseDragScaleVertical);
        appCanvas.removeEventListener('mousemove', mouseDragScaleHorizontal);
        appCanvas.removeEventListener('mousemove', mouseDragScaleAxles);
        appCanvas.removeEventListener('mousemove', mouseDragTrans);
        appCanvas.removeEventListener('mousemove', mouseDragRotateCar);
    });
});