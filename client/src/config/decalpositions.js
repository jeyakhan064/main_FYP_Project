export const decalPositions = {
    default: {
        logo: [-0.08, 0.12, 0.15],      // Front left top corner (polo style)
        back: [0, 0.04, -0.15],          // Back center
        leftSleeve: [-0.18, 0.04, 0],    // Left sleeve - covers entire sleeve
        rightSleeve: [0.18, 0.04, 0],    // Right sleeve - covers entire sleeve
        collar: [0, 0.15, 0.12],         // Collar/neck area
        tag: [0, -0.15, -0.13],          // Back tag inside
        full: [0, 0.04, 0.15],           // Full front coverage
    },

    // ALL models below will use AUTOMATIC CALCULATION
    // The system analyzes each model's 3D geometry and calculates optimal decal positions

    // T-Shirt - Use automatic calculation
    // "/models/shirt_baked.glb" will use automatic calculation

    // Women's Top - Use automatic calculation
    // "/models/womens_top.glb" will use automatic calculation

    // Hoodie - Use automatic calculation
    // "/models/hoodie.glb" will use automatic calculation

    // AGC Jacket - Use automatic calculation
    // "/models/agc_jacket.glb" will use automatic calculation

    // Cloth Jacket - Use automatic calculation
    // "/models/cloth_jacket.glb" will use automatic calculation

    // Hooded Jacket - Use automatic calculation
    // "/models/hooded_jacket.glb" will use automatic calculation

    // Indiana Jones Coat - Use automatic calculation
    // "/models/indiana_jones_wested_leather_coat.glb" will use automatic calculation

    // Jean Jacket - Use automatic calculation
    // "/models/jean_jacket.glb" will use automatic calculation

    // Varsity Jacket - Use automatic calculation
    // "/models/varsity_jacket.glb" will use automatic calculation

    // The Pants - Special configuration for pants
    // For pants: 'full' = belt area (horizontal strip), 'collar' = entire model coverage (360°)
    "/models/the_pants.glb": {
        positions: {
            back: [0, 0.0, -0.12],           // Back waist center
            leftSleeve: [-0.15, -0.2, 0.08], // Left leg side
            rightSleeve: [0.15, -0.2, 0.08], // Right leg side
            collar: [0, -0.1, 0.12],         // Full model coverage - centered on entire pants, moved forward
            tag: [0, -0.1, -0.1],            // Back tag inside
            full: [0, 0.1, 0.15],            // Belt area - positioned at waistband top
        },
        scale: {
            back: 0.25,                       // Medium back waist design
            leftSleeve: 0.4,                  // Leg side design
            rightSleeve: 0.4,                 // Leg side design
            collar: 4.2,                      // Full model coverage - increased by 20% (3.5 * 1.2 = 4.2)
            tag: 0.1,                         // Small tag
            full: [2.0, 1.0, 1.0],           // Belt area - wide horizontal strip for visibility
        }
    },
};
