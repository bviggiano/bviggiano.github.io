---
layout: post
title: A Formal Introduction to the Amino Acids
date: 2026-04-04
description: A visual tour of the 20 standard amino acids, their chemical properties, and the evolutionary logic encoded in substitution matrices and the genetic code.
tags:
  - biology
  - bioinformatics
mol3d: true
header_image: assets/img/amino-acids-hero.jpg
toc:
  sidebar: left
toc_depth: 4
---

When you [Google "amino acids,"](https://www.google.com/search?q=amino+acids) one of the first images you'll see is this [colorful diagram](https://cdn.technologynetworks.com/tn/images/body/aminoacids-pic3revised1574260662291.png), showing the skeletal formulas of twenty molecules grouped by the chemical character of their side chains. Throughout many biochemistry courses, I have found myself memorizing this exact chart.

<div style="max-width:50%; margin:0 auto;">
{% include figure.liquid path="assets/img/amino-acids-chart.png" caption="The chart of the 20 standard amino acids I have memorized too many times. Source: [Technology Networks](https://www.technologynetworks.com/applied-sciences/articles/amino-acids-functions-table-and-chart-324230)" class="img-fluid rounded" zoomable=true %}
</div>

I decided to write up a short reference on the amino acids and use this as an excuse to mess around with displaying molecules on my website!

## A brief aside on the amino acid synthetases

<figure style="float:right; max-width:350px; margin:0 0 1rem 1.5rem;">
{% include mol3d.liquid pdb="1ASY" spin="0.1" caption="Yeast aspartyl-tRNA synthetase (blue) bound to tRNA (orange/red). The synthetase recognizes both the tRNA and the amino acid, ensuring the correct pairing. Each organism inherits 20 of these enzymes, and that set determines which amino acids get loaded onto which tRNAs and therefore mapped to codons. If you change the synthetases, you change the genetic code itself. [PDB 1ASY](https://www.rcsb.org/structure/1ASY)" width="350px" height="350px" code="viewer.setStyle({chain: 'A'}, {cartoon: {color: '#4477AA'}}); viewer.setStyle({chain: 'B'}, {cartoon: {color: '#4477AA'}}); viewer.setStyle({chain: 'C'}, {cartoon: {style: 'tube', color: '#EE7733', thickness: 1.5}}); viewer.setStyle({chain: 'D'}, {cartoon: {style: 'tube', color: '#CC3311', thickness: 1.5}}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#4477AA'}, {chain: 'A'}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#4477AA'}, {chain: 'B'}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#EE7733'}, {chain: 'C'}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#CC3311'}, {chain: 'D'});" %}
</figure>

There are [over 800 naturally occurring amino acids](https://pmc.ncbi.nlm.nih.gov/articles/PMC7544725/) humans have found in nature, but only _20_ are directly encoded by the genetic code and incorporated into proteins during translation. These are the **proteinogenic** amino acids. What distinguishes them from the other 780+ is that each one is selected for by one of the 20 unique [aminoacyl-tRNA synthetases](https://en.wikipedia.org/wiki/Aminoacyl-tRNA_synthetase) (aaRS), each of which loads a specific amino acid onto the corresponding transfer RNAs (tRNAs), specified by their codons.

In my experience, the synthetases are often overlooked in introductory courses, but are arguably among the most important enzymes in molecular biology. They are [among the oldest enzymes in cells](https://academic.oup.com/nar/article/45/3/1059/2605964), predating the divergence of the domains of life. The 20 synthetases fall into [two structurally unrelated classes (Class I and Class II)](https://en.wikipedia.org/wiki/Aminoacyl_tRNA_synthetase#Classes), each with 10 members, that likely evolved independently. Despite having completely different protein folds, both classes solve the same problem: recognizing one amino acid out of twenty and attaching it to the right tRNA with an [overall translation error rate below 1 in 10,000](https://pubmed.ncbi.nlm.nih.gov/4643706/). Consider that some amino acids are chemically near-identical: valine and isoleucine differ by the placement of a _single methyl group_, yet the synthetases reliably distinguish them. Several synthetases have a dedicated [proofreading domain](https://en.wikipedia.org/wiki/Aminoacyl_tRNA_synthetase#:~:text=Some%20synthetases%20also%20mediate%20an%20editing%20reaction,valine%20and%20threonine), a second active site that hydrolyzes incorrectly charged tRNAs before the mischarged tRNA can reach the ribosome. The accuracy of the synthetases is so exceptional that they are distinguished with the term ["superspecificity"](https://pubmed.ncbi.nlm.nih.gov/6423966/). Not all synthetases have a dedicated editing domain; those that lack one compensate through highly specific binding and activation of their cognate amino acid. Interestingly, the accuracy of these attachments also depends on stoichiometry: cells must maintain a precise ratio of each synthetase to its cognate tRNAs, because overproduction of a synthetase leads to increased misacylation (the wrong amino acid is attached to the wrong tRNA).

> 61 sense codons (out of $4^3=64$ total, with 3 stop codons) map to 20 amino acids, mediated by [roughly 45 distinct tRNA species](https://en.wikipedia.org/wiki/Transfer_RNA) and exactly 20 synthetases, one for each amino acid (plus a 21st, selenocysteine, which we'll get to in the next section).

## The $21^*$ Proteinogenic Amino Acids

{% include figure.liquid path="assets/img/amino-acid-frequency.png" caption="Relative abundance of the 20 standard amino acids in proteins, grouped by side chain property. Frequencies from [UniProtKB/Swiss-Prot release 2026_01](https://web.expasy.org/docs/relnotes/relstat.html) (574,627 entries, 208M amino acids)." class="img-fluid rounded" zoomable=true %}

### Hydrophobic Side Chains

The largest group contains eight amino acids whose side chains are made mostly or entirely of carbon and hydrogen, making them nonpolar and hydrophobic. In a folded protein, these residues tend to cluster in the interior, away from water, forming the hydrophobic core that drives protein folding.

#### Alanine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/ala.svg' | relative_url }}" alt="Alanine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Ala | A | MW: 89.09 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>1</td></tr>
<tr><td>Frequency</td><td>~8.3%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/ala.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Alanine was one of the first amino acids <a href="https://en.wikipedia.org/wiki/Murchison_meteorite">detected in meteorites</a>. The simplest chiral amino acid, alanine's side chain is just a methyl group, making it a small, inert building block that fits almost anywhere in a protein. Its simplicity makes it the residue of choice in <a href="https://en.wikipedia.org/wiki/Alanine_scanning">alanine scanning mutagenesis</a>, where residues are systematically replaced with alanine to identify which side chains are functionally important.<sup><a href="#fn-ala-not-gly" id="fnref-ala-not-gly">*</a></sup>

</div>
</div>

#### Valine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/val.svg' | relative_url }}" alt="Valine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Val | V | MW: 117.15 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>3</td></tr>
<tr><td>Frequency</td><td>~6.9%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/val.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Valine is one of three <a href="https://en.wikipedia.org/wiki/Branched-chain_amino_acid">branched-chain amino acids</a> (BCAAs) metabolized in muscle rather than the liver. Its bulky, forked side chain makes it a common resident of hydrophobic cores. The single-nucleotide mutation that replaces glutamate with valine at position 6 of the hemoglobin β-chain causes sickle cell disease, one of the most well-known examples of how a single amino acid substitution can have dramatic consequences.
</div>
</div>

#### Isoleucine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/ile.svg' | relative_url }}" alt="Isoleucine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Ile | I | MW: 131.17 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>4</td></tr>
<tr><td>Frequency</td><td>~5.9%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/ile.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Isoleucine is one of only two amino acids (with threonine) that have two chiral centers. An isomer of leucine with the same molecular formula but a different branching pattern, only the (2S,3S) form is incorporated into proteins. Distinguishing isoleucine from valine is one of the classic challenges for the aminoacyl-tRNA synthetases, since the two differ by just a single methyl group.
</div>
</div>

#### Leucine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/leu.svg' | relative_url }}" alt="Leucine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Leu | L | MW: 131.17 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>4</td></tr>
<tr><td>Frequency</td><td>~9.6%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/leu.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Leucine is the most abundant amino acid in proteins and the strongest activator of <a href="https://en.wikipedia.org/wiki/MTOR">mTOR</a>, the master regulator of cell growth and protein synthesis. This dual role as both building block and growth signal makes it a key amino acid in nutrition and muscle biology.
</div>
</div>

#### Methionine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/met.svg' | relative_url }}" alt="Methionine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Met | M | MW: 149.21 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>4</td></tr>
<tr><td>Frequency</td><td>~2.4%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/met.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
<a href="https://en.wikipedia.org/wiki/Start_codon">AUG</a> (Met) is the universal start codon, so nearly every protein begins its life as a methionine (though most organisms later cleave it off). Paradoxically, methionine is the rarest of the hydrophobic amino acids at just ~2.4% frequency, partly because the sulfur in its side chain makes it metabolically expensive to produce. Methionine is also the precursor to <a href="https://en.wikipedia.org/wiki/S-Adenosyl_methionine">S-adenosylmethionine</a> (SAM), the cell's universal methyl donor.
</div>
</div>

#### Phenylalanine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/phe.svg' | relative_url }}" alt="Phenylalanine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Phe | F | MW: 165.19 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>7</td></tr>
<tr><td>Frequency</td><td>~3.9%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/phe.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Phenylalanine is the reason diet soda cans say "contains phenylalanine": the artificial sweetener aspartame is a dipeptide of aspartate and phenylalanine, which is dangerous for people with <a href="https://en.wikipedia.org/wiki/Phenylketonuria">phenylketonuria</a> (PKU), a genetic disorder in which phenylalanine cannot be properly metabolized and accumulates to toxic levels.
</div>
</div>

#### Tyrosine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/tyr.svg' | relative_url }}" alt="Tyrosine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Tyr | Y | MW: 181.19 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>8</td></tr>
<tr><td>Frequency</td><td>~2.9%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/tyr.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Named from the Greek <em>tyros</em> (cheese), tyrosine is the precursor to dopamine, adrenaline, and thyroid hormones. Structurally it is phenylalanine with a hydroxyl group on the ring, placing it at the boundary between hydrophobic and polar. That hydroxyl is a key target for phosphorylation by tyrosine kinases, and dysregulated tyrosine kinase signaling is implicated in many cancers, making tyrosine kinase inhibitors (like imatinib) among the most successful targeted cancer therapies.
</div>
</div>

#### Tryptophan

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/trp.svg' | relative_url }}" alt="Tryptophan structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Trp | W | MW: 204.23 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>10</td></tr>
<tr><td>Frequency</td><td>~1.1%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/trp.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
The rarest standard amino acid and the biosynthetic precursor to <a href="https://en.wikipedia.org/wiki/Serotonin">serotonin</a> and <a href="https://en.wikipedia.org/wiki/Melatonin">melatonin</a>. Tryptophan's indole ring system absorbs UV light at 280 nm, which is why protein concentration is routinely measured by UV absorbance at that wavelength. Despite popular belief, turkey does not contain unusually high levels of tryptophan; post-Thanksgiving drowsiness is more likely from overeating carbohydrates, which increase tryptophan transport across the blood-brain barrier.
</div>
</div>

{% assign aa_code = "var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}

### Electrically Charged Side Chains

Five amino acids carry a net charge at physiological pH. Three are positively charged (arginine, histidine, lysine) and two are negatively charged (aspartate, glutamate). These residues are almost always found on protein surfaces, where they interact with water, form salt bridges with oppositely charged residues, and participate in catalysis.

#### Arginine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/arg.svg' | relative_url }}" alt="Arginine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Arg | R | MW: 174.20 Da</div>
<table>
<tr><td>Charge</td><td>+1</td></tr>
<tr><td>Heavy R atoms</td><td>7</td></tr>
<tr><td>Frequency</td><td>~5.5%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/arg.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Arginine's <a href="https://en.wikipedia.org/wiki/Guanidinium_cation">guanidinium group</a> (pKa ~12.5) is almost always protonated and can form up to five hydrogen bonds simultaneously, making it the amino acid most frequently found interacting with phosphate groups in DNA-binding proteins. Arginine is also the precursor to <a href="https://en.wikipedia.org/wiki/Nitric_oxide">nitric oxide</a> (NO), whose discovery as a signaling molecule won the 1998 Nobel Prize.
</div>
</div>

#### Histidine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/his.svg' | relative_url }}" alt="Histidine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">His | H | MW: 155.16 Da</div>
<table>
<tr><td>Charge</td><td>~0 (pKa ~6.0)</td></tr>
<tr><td>Heavy R atoms</td><td>5</td></tr>
<tr><td>Frequency</td><td>~2.3%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/his.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Histidine's <a href="https://en.wikipedia.org/wiki/Imidazole">imidazole</a> side chain has a pKa (~6.0) near physiological pH, making it the only amino acid that can readily toggle between protonated and deprotonated states under biological conditions. This is why histidine appears in more enzyme active sites than any other residue relative to its abundance, acting as both a proton donor and acceptor in catalysis.
</div>
</div>

#### Lysine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/lys.svg' | relative_url }}" alt="Lysine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Lys | K | MW: 146.19 Da</div>
<table>
<tr><td>Charge</td><td>+1</td></tr>
<tr><td>Heavy R atoms</td><td>5</td></tr>
<tr><td>Frequency</td><td>~5.8%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/lys.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Lysine's long, flexible side chain ending in an ε-amino group (pKa ~10.5) makes it the primary target for <a href="https://en.wikipedia.org/wiki/Ubiquitin">ubiquitination</a> (the tag that marks proteins for degradation) and for histone acetylation/methylation, which regulate gene expression. The versatility of lysine's post-translational modifications makes it arguably the most heavily regulated residue in epigenetics.
</div>
</div>

#### Aspartate

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/asp.svg' | relative_url }}" alt="Aspartate structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Asp | D | MW: 133.10 Da</div>
<table>
<tr><td>Charge</td><td>-1</td></tr>
<tr><td>Heavy R atoms</td><td>3</td></tr>
<tr><td>Frequency</td><td>~5.5%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/asp.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
<a href="https://en.wikipedia.org/wiki/Racemization">Aspartate racemization</a> (slow conversion from L to D form) accumulates over a human lifetime and is used as a molecular clock for forensic age estimation from teeth and eye lens proteins, which do not turn over. Aspartate is also the shorter of the two negatively charged amino acids, making it a common ligand for metal ions in enzyme active sites.
</div>
</div>

#### Glutamate

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/glu.svg' | relative_url }}" alt="Glutamate structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Glu | E | MW: 147.13 Da</div>
<table>
<tr><td>Charge</td><td>-1</td></tr>
<tr><td>Heavy R atoms</td><td>4</td></tr>
<tr><td>Frequency</td><td>~6.7%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/glu.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Glutamate is the most abundant excitatory <a href="https://en.wikipedia.org/wiki/Neurotransmitter">neurotransmitter</a> in the brain and the source of "<a href="https://en.wikipedia.org/wiki/Umami">umami</a>," the fifth basic taste, discovered by Kikunae Ikeda in 1908 when he isolated monosodium glutamate (MSG) from kelp broth. In proteins, glutamate's extra methylene group compared to aspartate gives it more conformational flexibility for forming salt bridges.
</div>
</div>

### Polar Uncharged Side Chains

These four amino acids have side chains that can form hydrogen bonds with water and other polar groups, but carry no net charge at physiological pH. This makes them common on protein surfaces and at active sites, where hydrogen bonding is critical.

#### Serine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/ser.svg' | relative_url }}" alt="Serine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Ser | S | MW: 105.09 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>2</td></tr>
<tr><td>Frequency</td><td>~6.7%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/ser.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Serine is the most commonly <a href="https://en.wikipedia.org/wiki/Phosphorylation">phosphorylated</a> amino acid in eukaryotic cells: roughly 86% of all protein phosphorylation events occur on serine residues (vs. ~12% threonine, ~2% tyrosine). Its small hydroxyl group also makes it a key nucleophile in the active sites of serine proteases, one of the largest enzyme families.
</div>
</div>

#### Threonine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/thr.svg' | relative_url }}" alt="Threonine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Thr | T | MW: 119.12 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>3</td></tr>
<tr><td>Frequency</td><td>~5.4%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/thr.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Threonine was the last of the 20 standard amino acids to be discovered (by William Rose in 1935), and it was named after <a href="https://en.wikipedia.org/wiki/Threose">threose</a>, the four-carbon sugar it resembles. Like isoleucine, threonine has two chiral centers. Its discovery led Rose to define the concept of essential amino acids.
</div>
</div>

#### Asparagine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/asn.svg' | relative_url }}" alt="Asparagine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Asn | N | MW: 132.12 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>4</td></tr>
<tr><td>Frequency</td><td>~4.1%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/asn.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Asparagine was the very first amino acid to be isolated (from asparagus juice in 1806 by <a href="https://en.wikipedia.org/wiki/Louis_Nicolas_Vauquelin">Vauquelin</a> and <a href="https://en.wikipedia.org/wiki/Pierre_Jean_Robiquet">Robiquet</a>). Asparagine is the most common site for <a href="https://en.wikipedia.org/wiki/N-linked_glycosylation">N-linked glycosylation</a>, one of the most important post-translational modifications, where sugar chains are attached to the protein surface.
</div>
</div>

#### Glutamine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/gln.svg' | relative_url }}" alt="Glutamine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Gln | Q | MW: 146.15 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>5</td></tr>
<tr><td>Frequency</td><td>~3.9%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/gln.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Glutamine is the most abundant free amino acid in human blood plasma (~500-900 μM), serving as a nitrogen shuttle between organs. Rapidly dividing cells, including immune cells and cancer cells, consume glutamine in enormous quantities, a phenomenon called "<a href="https://en.wikipedia.org/wiki/Glutaminolysis">glutamine addiction</a>" that is now a target for cancer therapy.
</div>
</div>

### Special Cases

These three amino acids have unusual structural properties that set them apart from the other groups.

#### Cysteine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/cys.svg' | relative_url }}" alt="Cysteine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Cys | C | MW: 121.16 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>2</td></tr>
<tr><td>Frequency</td><td>~1.4%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/cys.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Two cysteines can form a <a href="https://en.wikipedia.org/wiki/Disulfide_bond">disulfide bond</a> (cystine), which acts like a molecular staple holding protein structures together. This is also the chemistry behind hair perms: breaking and reforming disulfide bonds in keratin reshapes the hair. Cysteine's thiol group (pKa ~8.3) also makes it a key catalytic nucleophile in many enzymes.
</div>
</div>

#### Glycine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/gly.svg' | relative_url }}" alt="Glycine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Gly | G | MW: 75.03 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>0</td></tr>
<tr><td>Frequency</td><td>~7.1%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/gly.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Glycine is the only <a href="https://en.wikipedia.org/wiki/Chirality_(chemistry)">achiral</a> amino acid (no stereocenters) and the smallest. Because it lacks a side chain, glycine is uniquely flexible and dominates the tight turns in collagen's triple helix, where every third residue must be glycine to fit inside the helix (the Gly-X-Y repeat). Glycine was also among the amino acids <a href="https://en.wikipedia.org/wiki/Murchison_meteorite">found in meteorites</a> and detected in interstellar space.
</div>
</div>

#### Proline

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/pro.svg' | relative_url }}" alt="Proline structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Pro | P | MW: 115.13 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>3</td></tr>
<tr><td>Frequency</td><td>~4.7%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/pro.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Proline is the only standard amino acid with a <a href="https://en.wikipedia.org/wiki/Secondary_amine">secondary amine</a>: its side chain cyclizes back onto the backbone nitrogen, locking the backbone into a rigid conformation. This rigidity makes proline a "helix breaker" and allows it to uniquely adopt a <a href="https://en.wikipedia.org/wiki/Cis%E2%80%93trans_isomerism">cis peptide bond</a> (~5% of the time vs. less than 0.1% for other residues). The cis-trans isomerization is so slow that dedicated enzymes (<a href="https://en.wikipedia.org/wiki/Prolyl_isomerase">prolyl isomerases</a>) exist to catalyze it, sometimes being the rate-limiting step in protein folding.
</div>
</div>

### The 21st Proteinogenic Amino Acid

Selenocysteine (Sec, U) is a structural analog of cysteine with a selenium atom in place of sulfur. It is found across all three domains of life but is not universal (fungi and higher plants have lost it, for example). What makes it remarkable is how it ends up in proteins. Every other proteinogenic amino acid is specified by one or more sense codons, delivered by a dedicated tRNA, and charged by its own aminoacyl-tRNA synthetase. Selenocysteine has none of these things.

Selenocysteine has neither a codon of its own nor a dedicated aminoacyl-tRNA synthetase. It is encoded by [**UGA**](https://en.wikipedia.org/wiki/Stop_codon), normally one of three stop codons, and the specialized [tRNA^Sec](https://en.wikipedia.org/wiki/TRNA-Sec) that carries it is first charged with _serine_ by seryl-tRNA synthetase, then converted to selenocysteine directly on the tRNA by [selenocysteine synthase](https://en.wikipedia.org/wiki/Selenocysteine_synthase). And the ribosome only recodes UGA from "stop" to "selenocysteine" when the mRNA contains a downstream stem-loop called a [**SECIS element**](https://en.wikipedia.org/wiki/SECIS_element) (selenocysteine insertion sequence), which is bound by a specialized elongation factor (SelB in bacteria, EFSec in eukaryotes) that recruits the charged tRNA^Sec to the UGA codon.

#### Selenocysteine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/sec.svg' | relative_url }}" alt="Selenocysteine structure" data-zoomable>
</div>
<div class="aa-card-stats">
<div class="aa-codes">Sec | U | MW: 168.05 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>Heavy R atoms</td><td>2</td></tr>
<tr><td>Frequency</td><td>&lt; 0.01%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/sec.sdf" spin="0.2" width="180px" height="180px" code=aa_code %}
</div>
</div>
<div class="aa-card-body">
Selenocysteine's selenol group is a much stronger nucleophile than cysteine's thiol (pKa ~5.2 vs. ~8.3), so at physiological pH it is already deprotonated and reactive. It sits in the active sites of roughly <a href="https://en.wikipedia.org/wiki/Selenoprotein">25 human selenoproteins</a>, including glutathione peroxidases that protect cells from oxidative damage and thyroid hormone deiodinases that regulate thyroid function.
</div>
</div>

## Substitution Matrices

Proteins evolve, and when we compare homologous proteins from different species we find that some amino acids substitute for each other constantly while others almost never do. The pattern is not random; it reflects which substitutions the protein can tolerate, which in turn reflects the physicochemical similarity of the amino acids involved.

The standard way to quantify this is a **substitution matrix**: a 20×20 table where each entry is a score for how likely it is that one amino acid replaces another in evolution. Positive scores mean "more common than chance" (the substitution is tolerated), and negative scores mean "less common than chance" (the substitution is avoided). The most widely used is [BLOSUM62](https://en.wikipedia.org/wiki/BLOSUM), derived in 1992 by Steven and Jorja Henikoff from conserved blocks of homologous protein sequences. The "62" refers to the clustering threshold: before counting substitutions, sequence pairs with ≥62% identity were clustered together so that closely-related sequences wouldn't dominate the statistics. BLOSUM62 is the default matrix in BLAST and in most protein alignment tools.

BLOSUM scores aren't arbitrary numbers; they're **log-odds ratios**. The score for substituting amino acid $i$ with amino acid $j$ is:

$$S_{ij} = \frac{1}{\lambda} \log_2 \frac{p_{ij}}{q_i q_j}$$

where $p_{ij}$ is the observed probability that $i$ and $j$ appear aligned in conserved blocks of homologous proteins, $q_i$ and $q_j$ are the background frequencies of each amino acid in the dataset, and $\lambda$ is a scaling factor chosen to make the final scores convenient integers.

The ratio $p_{ij} / (q_i q_j)$ compares the observed substitution frequency to what you'd expect if the two amino acids paired up purely by chance. A positive $S_{ij}$ means the substitution is more common than chance (the pair co-occurs in conserved positions more often than random pairing would predict), a negative $S_{ij}$ means it's rarer than chance (evolution avoids it), and a score of zero means observed matches expected. Taking the log turns this ratio into an additive score, so that when you score an alignment of two sequences, you can simply sum the per-position scores to get a total log-odds score for the alignment.

{% include figure.liquid path="assets/img/blosum62-heatmap.png" caption="BLOSUM62 substitution scores for all 20 standard amino acids, grouped by side chain property and sorted within each group by number of side chain heavy atoms (shown in parentheses). Red = favored substitution (positive score); blue = avoided substitution (negative score). The diagonal is masked in black because self-substitution scores are always the largest." class="img-fluid rounded" zoomable=true %}

A few patterns jump out. Within each property group, most substitutions score near zero or positive, especially between amino acids of similar size: the branched-chain hydrophobic residues (Val, Ile, Leu) interchange readily, as do Asp and Glu (the two negatively charged residues) and Lys and Arg (two of the three positively charged ones). The hydrophobic aromatic residues (Phe, Tyr, Trp) also cluster together. Between groups, the scores turn negative: substituting a small hydrophobic residue for a charged one almost never happens in conserved positions, because the physicochemical mismatch is too large.

The most striking row in the matrix belongs to tryptophan. Trp is the largest and rarest amino acid, and its substitution scores are among the most negative in the matrix. When a tryptophan appears in a conserved position in a protein, it's almost always doing something specific; evolution rarely allows it to be swapped out.

## The Genetic Code

Substitution matrices tell us which amino acids are exchangeable in protein space, but there's a second layer we haven't touched: the DNA itself. Every substitution that makes it into a protein has to survive translation, which means it has to be reachable by a small number of point mutations in the underlying mRNA. The mapping from nucleotide triplets to amino acids, the **genetic code**, is what determines which substitutions are "close" in mutational space and which are far away.

<div style="max-width:60%; margin:0 auto;">
{% include figure.liquid path="assets/img/genetic-code-wheel.png" caption="The standard RNA codon wheel. Read from the center outward: the first base (center), then the second base, then the third base, to find the encoded amino acid on the outer ring. Public domain via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aminoacids_table.svg)." class="img-fluid rounded" zoomable=true %}
</div>

Three things stand out from the standard code. First, it is **redundant**: 61 sense codons map to 20 amino acids, so most amino acids are encoded by multiple codons (leucine, serine, and arginine each get six; only methionine and tryptophan get exactly one). Second, the redundancy is concentrated at the **third position** of the codon; changing the third base often leaves the amino acid unchanged. This is the [wobble position](https://en.wikipedia.org/wiki/Wobble_base_pair), and it acts as a buffer against point mutations in DNA: a random mutation at the third position is the mutation most likely to be silent. Third, even when a point mutation does change the amino acid, the code is structured so that the replacement is usually **chemically similar**. Mutations at the first position tend to swap hydrophobic residues for other hydrophobic residues; mutations at the second position are [the most likely to cause a radical change in physicochemical properties](https://en.wikipedia.org/wiki/Genetic_code#:~:text=A%20mutation%20at%20the%20second%20position%20is%20likely%20to%20cause%20a%20radical%20change), but even then the code is biased toward minimizing the damage.

We can quantify this directly. For each pair of amino acids, we can count how many ways a single-nucleotide substitution in any of their codons converts one into the other. This gives us a 20×20 connectivity matrix that reflects which amino acids are "mutational neighbors."

{% include figure.liquid path="assets/img/codon-substitution-heatmap.png" caption="Single-nucleotide substitution paths between amino acids. Each cell counts the number of ways a single point mutation in any codon for one amino acid can produce a codon for the other. Amino acids are grouped by property (same colors as before) so that the block-diagonal structure jumps out: most single-nucleotide paths stay within a property group." class="img-fluid rounded" zoomable=true %}

The connectivity matrix has a clear block-diagonal structure. Most single-nucleotide paths stay within a property group, which means the genetic code has been sculpted (by natural selection, or by the ancient history of which tRNAs matched which codons) to minimize the physicochemical impact of a random mutation. This "error-minimizing" property is sometimes called the [genetic code's robustness](https://en.wikipedia.org/wiki/Genetic_code#:~:text=Any%20evolutionary%20model%20for%20the%20code%27s%20origin%20must%20account%20for%20its%20robustness), and it is widely considered one of the strongest pieces of evidence that the code is not arbitrary; it has been optimized.

The alignment between substitution matrices and mutational proximity is not accidental. The substitution matrices we saw in the previous section are measured from real protein evolution, which is the combined outcome of (a) which mutations occur at the DNA level and (b) which mutations survive selection at the protein level. The genetic code's error-minimizing layout means that (a) already pre-filters for physicochemical similarity, and selection imposes the remaining constraint.

---

<div class="footnotes" style="font-size: 0.85em; color: var(--global-text-color-light);">
<p id="fn-ala-not-gly"><a href="#fnref-ala-not-gly">*</a> Why alanine and not glycine, the simplest amino acid? Glycine's lack of any side chain gives it unusual backbone flexibility, so substituting glycine would change the protein's conformational dynamics, not just remove the side chain's chemistry. Alanine's methyl group constrains the backbone like a normal amino acid while contributing almost nothing chemically.</p>
</div>
