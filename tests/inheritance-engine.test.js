const E=require('../assets/js/inheritance-engine.js');
const close=(a,b)=>Math.abs(a-b)<1e-10;
const share=(out,key)=>{const x=out.shares.find(s=>s.key===key);return x?E.num(x.share):0};
const scenarios=[
 ['wife + parents',{gender:'male',wives:1,mother:1,father:1},{wives:1/4,mother:1/4,father:1/2}],
 ['husband + parents',{gender:'female',husband:1,mother:1,father:1},{husband:1/2,mother:1/6,father:1/3}],
 ['husband + mother + grandfather',{gender:'female',husband:1,mother:1,grandfather:1},{husband:1/2,mother:1/3,grandfather:1/6}],
 ['wife + daughter radd',{gender:'male',wives:1,daughters:1},{wives:1/8,daughters:7/8}],
 ['daughter + full sister',{gender:'male',daughters:1,fullSisters:1},{daughters:1/2,fullSisters:1/2}],
 ['two daughters + father',{gender:'male',daughters:2,father:1},{daughters:2/3,father:1/3}],
 ['awl',{gender:'male',wives:1,mother:1,fullSisters:2},{wives:3/13,mother:2/13,fullSisters:8/13}],
 ['full nephew residuary',{gender:'male',wives:1,fullNephews:2},{wives:1/4,fullNephews:3/4}],
 ['paternal nephew residuary',{gender:'male',wives:1,paternalNephews:1},{wives:1/4,paternalNephews:3/4}],
 ['mother only radd',{gender:'male',mother:1},{mother:1}]
];
let failures=0;
for(const [name,data,expected] of scenarios){
 const out=E.calculate(data);
 if(out.status!=='ok'){console.error(name,'unexpected status',out.status);failures++;continue;}
 for(const [key,value] of Object.entries(expected))if(!close(share(out,key),value)){console.error(name,key,share(out,key),'!=',value);failures++;}
 if(!close(E.num(out.total),1)){console.error(name,'sum',E.num(out.total));failures++;}
}
const spouse=E.calculate({gender:'male',wives:1});
if(spouse.status!=='confirm-dhawu'){console.error('spouse-only should require dhawu al-arham confirmation');failures++;}
const spouseConfirmed=E.calculate({gender:'male',wives:1,confirmNoDhawuAlArham:true});
if(spouseConfirmed.status!=='ok'||!close(share(spouseConfirmed,'wives'),1)){console.error('confirmed spouse-only case failed');failures++;}
const dhu=E.calculate({gender:'male',wives:1,hasDhawuAlArham:true});
if(dhu.status!=='refer'){console.error('dhawu al-arham case should refer');failures++;}
console.log(failures?`FAIL ${failures}`:'PASS 13 scenarios');
process.exitCode=failures?1:0;