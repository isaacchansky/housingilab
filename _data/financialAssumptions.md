- 
  parameter: "Land Area"
  value: "12,800 sqft"
  comment: "The site and land area has been generated manually, representing a generic development site in Boston."
- 
  parameter: "Average Apartment Area (GSF) (Standard sizing)"
  value: "960 sqft"
  comment: >
  The average apartment area in gross square feet (construction area) is calculated using the method described in the City of Boston's JP/ROX Density Bonus Program Financial Analysis (September 2016).
   
   It evaluates this by combining the apartment-type share and their respective net square footage, and divides this by the indsutry-standard assumption construction efficiency rate of 85%, which takes into account area outside of units like hallways and stairwells. The breakdown is as follows (modified to avoid rounding errors).
    -
      Unit Type: "Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom", "All"
    -
      Share of Total: "22%", "28%", "33%", "17%", "100%"
    -
      NSF per Unit: "500 sqft", "750 sqft", "900 sqft", "1200 sqft", "820 sqft"
    The gross-square-footage of this average is 960 sqft (after rounding to nearest 10 sqft)
-
  parameter: "Land Cost"
  value: "$90 per sqft"
  comment: "The cost of land was provided by the City of Boston's JP/ROX Density Bonus Program Financial Analysis (September 2016), which used figures provided by Byrne-McKinney & Assoc. and a survey of housing developers."
-
  parameter: "Construction Cost (Wood, No Podium)"
  value: "$180 per sqft"
  comment: ""