// Customer-facing selection. Personal projects remain in the source catalog.
export const WORK_GALLERY = [
  {id:'lanewise',type:'AI helper',status:'Early access',copy:'Freight quote emails become ready-to-review drafts.'},
  {id:'spectiq',type:'Web app',status:'Early access',copy:'Brings inspection inquiries, estimates and next steps together. Payment and booking connections are in progress.'},
  {id:'sproutify-farm',type:'Web app',copy:'Runs our own commercial farm: orders, seeding and harvest.'},
  {id:'atl-urban-farms',type:'Online store',copy:'Live seedlings sold and shipped online.'},
  {id:'rejoice',type:'Mobile app',copy:'Scripture, prayer and reflection on your phone.'},
  {id:'rekkrd',type:'AI app',copy:'Snap a record to identify it and add it to your collection.'},
  {id:'once-upon-a-drawing',type:'AI app',copy:'Turn a child’s drawing into a personalized storybook.'},
  {id:'sproutify',type:'Mobile app',copy:'Keep track of the plants you grow at home.'},
  {id:'sproutify-classrooms',type:'Web app',copy:'Bring growing projects and plant care into the classroom.'},
  {id:'sproutify-micro',type:'Web app',copy:'Track microgreen trays from seeding through harvest and orders.'},
];

export const WORK_VISUALS: Record<string,{image:string;alt:string;width:number;height:number}> = {
 'lanewise': {image:'/images/lanewise-site.png',alt:'Screenshot of the LaneWise website showing a sample freight request and a quote draft for review',width:1265,height:712},
 'spectiq': {image:'/images/spectiq-site.png',alt:'Screenshot of the SpectIQ website with its illustrative inspection deal preview',width:1265,height:712},
 'sproutify-farm': {image:'/images/optimized/sproutify-farm.webp',alt:'Leafy greens growing in aeroponic towers, the type of farm Sproutify Farm supports',width:692,height:922},
};
