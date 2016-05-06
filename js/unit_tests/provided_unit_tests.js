'use strict';

var expect = chai.expect;

var sceneModule = createSceneGraphModule();

describe('Provided unit tests', function() {
    it('Test origin being in CarNode before transform', function() {
        var carNode = new sceneModule.CarNode();
        var pointInObj = carNode.pointInObject({x: 0, y: 0});

        expect(pointInObj, '0, 0 should be in CarNode, this is initial render place.').to.be.true;
    });

    it('Test origin being in CarNode after translating', function() {
        var carNode = new sceneModule.CarNode();
        carNode.objectTransform.preTranslate(800, 800);
        var pointInObj = carNode.pointInObject({x: 0, y: 0});
        expect(pointInObj, '0,0 should still be inside CarNode even after being moved to 800,800 because pointInObject should use local coords').to.be.true;
    });

    it('Test swapping child of CarNode', function() {
        var carNode = new sceneModule.CarNode();
        var frontRightAxle = new sceneModule.AxleNode(sceneModule.FRONT_RIGHT_AXLE_PART);
        var frontRightAxle2 = new sceneModule.AxleNode(sceneModule.FRONT_RIGHT_AXLE_PART);

        carNode.addChild(frontRightAxle);

        expect(carNode.children[sceneModule.FRONT_RIGHT_AXLE_PART] == frontRightAxle, "Should be first front right axle").to.be.true;

        carNode.replaceGraphNode(sceneModule.FRONT_RIGHT_AXLE_PART, frontRightAxle2);

        expect(carNode.children[sceneModule.FRONT_RIGHT_AXLE_PART] != frontRightAxle && carNode.children[sceneModule.FRONT_RIGHT_AXLE_PART] == frontRightAxle2,
            'Should be second front right axle but not first since it was replaced').to.be.true;
    });

    it('Test that child is added', function() {
        var carNode = new sceneModule.CarNode();
        var backBumper = new sceneModule.BumperNode(sceneModule.BOTTOM_BUMPER_PART);

        carNode.addChild(backBumper);

        expect(carNode.children[sceneModule.BOTTOM_BUMPER_PART] == backBumper, "backBumper should now be a child of carNode").to.be.true;
    });

    it('Test width change of CarNode', function() {
        var carNode = new sceneModule.CarNode();

        expect(carNode.pointInObject({x: 26, y: 0}), "It is not that wide!").to.be.false;

        sceneModule.setCarWidth(53);

        expect(carNode.pointInObject({x: 26, y: 0}), "Now it is that wide!").to.be.true;
    });
});
