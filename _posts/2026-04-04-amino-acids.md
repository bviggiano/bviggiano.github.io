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
{% include figure.liquid path="assets/img/amino-acids-chart.png" caption="The chart of the 20 standard amino acids I have memorized too many times. Source: [Technology Networks](https://www.technologynetworks.com/applied-sciences/articles/amino-acids-functions-table-and-chart-324230)" class="img-fluid rounded" %}
</div>

I've often glanced these over and moved on to higher-level concepts like enzyme mechanics or structure analysis, but this time I wanted to appreciate the amino acids a bit more. This blog post is my love letter to the building blocks of proteins!

## A brief aside on the amino acid synthetases

<figure style="float:right; max-width:350px; margin:0 0 1rem 1.5rem;">
{% include mol3d.liquid pdb="1ASY" spin="0.1" caption="Yeast aspartyl-tRNA synthetase (blue) bound to tRNA (orange/red). The synthetase recognizes both the tRNA and the amino acid, ensuring the correct pairing. Each organism inherits 20 of these enzymes, and that set determines which amino acids get loaded onto which tRNAs and therefore mapped to codons. If you change the synthetases, and you change the genetic code itself. [PDB 1ASY](https://www.rcsb.org/structure/1ASY)" width="350px" height="350px" code="viewer.setStyle({chain: 'A'}, {cartoon: {color: '#4477AA'}}); viewer.setStyle({chain: 'B'}, {cartoon: {color: '#4477AA'}}); viewer.setStyle({chain: 'C'}, {cartoon: {style: 'tube', color: '#EE7733', thickness: 1.5}}); viewer.setStyle({chain: 'D'}, {cartoon: {style: 'tube', color: '#CC3311', thickness: 1.5}}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#4477AA'}, {chain: 'A'}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#4477AA'}, {chain: 'B'}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#EE7733'}, {chain: 'C'}); viewer.addSurface($3Dmol.SurfaceType.VDW, {opacity: 0.55, color: '#CC3311'}, {chain: 'D'});" %}
</figure>

There are [over 800 naturally occurring amino acids](https://pmc.ncbi.nlm.nih.gov/articles/PMC7544725/) humans have found in nature, but only _20_ are directly encoded by the genetic code and incorporated into proteins during translation. These are the **proteinogenic** amino acids. What distinguishes them from the other 780+ is that each one is selected for by one of the 20 unique [aminoacyl-tRNA synthetases](https://en.wikipedia.org/wiki/Aminoacyl-tRNA_synthetase) (aaRS), each of which loads a specific amino acid onto the corresponding transfer RNAs (tRNAs), specified by their codons.

In my expirence, the synthetases are often overlooked in introductory courses, but are arguably one of the most important enzymes in molecular biology. They are [among the oldest enzymes in cells](https://academic.oup.com/nar/article/45/3/1059/2605964), predating the divergence of the domains of life. The 20 synthetases fall into [two structurally unrelated classes (Class I and Class II)](https://en.wikipedia.org/wiki/Aminoacyl_tRNA_synthetase#Classes), each with 10 members, that likely evolved independently. Despite having completely different protein folds, both classes solve the same problem: recognizing one amino acid out of twenty and attaching it to the right tRNA with an [overall translation error rate below 1 in 10,000](https://pubmed.ncbi.nlm.nih.gov/4643706/). Consider that some amino acids are chemically near-identical: valine and isoleucine differ by the placement of a _single methyl group_, yet the synthetases reliably distinguish them. Several synthetases have a dedicated [proofreading domain](https://en.wikipedia.org/wiki/Aminoacyl_tRNA_synthetase#:~:text=Some%20synthetases%20also%20mediate%20an%20editing%20reaction,valine%20and%20threonine), a second active site that hydrolyzes incorrectly charged tRNAs before the mischarged tRNA can reach the ribosome. The accuracy of the synthetases is so exceptional that they are distinguished with the term ["superspecificity"](https://pubmed.ncbi.nlm.nih.gov/6423966/). Not all synthetases have a dedicated editing domain; those that lack one compensate through highly specific binding and activation of their cognate amino acid. Interestingly, the accuracy of these attachments also depends on stoichiometry: cells must maintain a precise ratio of each synthetase to its cognate tRNAs, because overproduction of a synthetase leads to increased misacylation (the wrong amino acid is attached to the wrong tRNA).

> 61 sense codons (out of $4^3=64$ total, with 3 stop codons) map to 20 amino acids, mediated by [roughly 45 distinct tRNA species](https://en.wikipedia.org/wiki/Transfer_RNA) and exactly 20 synthetases, one for each amino acid (plus a 21st, selenocysteine, which we'll get to in the next section).

## The $21^*$ Proteinogenic Amino Acids

{% include figure.liquid path="assets/img/amino-acid-frequency.png" caption="Relative abundance of the 20 standard amino acids in proteins, grouped by side chain property. Frequencies from [UniProtKB/Swiss-Prot release 2026_01](https://web.expasy.org/docs/relnotes/relstat.html) (574,627 entries, 208M amino acids)." class="img-fluid rounded" %}

### Hydrophobic Side Chains

The largest group contains eight amino acids whose side chains are made mostly or entirely of carbon and hydrogen, making them nonpolar and hydrophobic. In a folded protein, these residues tend to cluster in the interior, away from water, forming the hydrophobic core that drives protein folding.

#### Alanine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/ala.svg' | relative_url }}" alt="Alanine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Ala | A | MW: 89.09 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>1</td></tr>
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
<img src="{{ 'assets/img/amino-acids/val.svg' | relative_url }}" alt="Valine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Val | V | MW: 117.15 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>3</td></tr>
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
<img src="{{ 'assets/img/amino-acids/ile.svg' | relative_url }}" alt="Isoleucine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Ile | I | MW: 131.17 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>4</td></tr>
<tr><td>Frequency</td><td>~5.9%</td></tr>
</table>
</div>
<div class="aa-card-3d">
{% include mol3d.liquid file="assets/mol/amino-acids/ile.sdf" spin="0.2" width="180px" height="180px" code="var atoms=viewer.selectedAtoms({}); var byS={}; atoms.forEach(function(a){byS[a.serial]=a}); var cC=null; atoms.forEach(function(a){if(a.elem==='C'){var oc=0;a.bonds.forEach(function(b){if(byS[b]&&byS[b].elem==='O')oc++});if(oc>=2)cC=a}}); var bb=new Set(); if(cC){bb.add(cC.index); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='O')bb.add(n.index)}); cC.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='C'){var hN=false;n.bonds.forEach(function(b2){if(byS[b2]&&byS[b2].elem==='N')hN=true});if(hN){bb.add(n.index);n.bonds.forEach(function(b2){var n2=byS[b2];if(n2&&(n2.elem==='N'||n2.elem==='H'))bb.add(n2.index);if(n2&&n2.elem==='N')n2.bonds.forEach(function(b3){if(byS[b3]&&byS[b3].elem==='H')bb.add(byS[b3].index)})})}}})} var caA=null;bb.forEach(function(idx){var a=atoms[idx];if(a&&a.elem==='C'){var hN=false,hC2=false;a.bonds.forEach(function(b){var n=byS[b];if(n&&n.elem==='N'&&bb.has(n.index))hN=true;if(n&&n.elem==='C'&&bb.has(n.index)&&n.index!==idx)hC2=true});if(hN&&hC2)caA=a}});if(caA){var sh=atoms.filter(function(a){return!bb.has(a.index)&&a.elem!=='H'});if(sh.length){var mx=0,my=0,mz=0;sh.forEach(function(a){mx+=a.x;my+=a.y;mz+=a.z});mx/=sh.length;my/=sh.length;mz/=sh.length;var dx=mx-caA.x,dy=my-caA.y,dz=mz-caA.z,l=Math.sqrt(dx*dx+dy*dy+dz*dz);if(l>0){dx/=l;dy/=l;dz/=l;var kx=-dz,kz=dx,rl=Math.sqrt(kx*kx+kz*kz);if(rl>0.001){kx/=rl;kz/=rl;var ang=Math.acos(Math.max(-1,Math.min(1,dy))),co=Math.cos(ang),si=Math.sin(ang),ox=caA.x,oy=caA.y,oz=caA.z;atoms.forEach(function(a){var vx=a.x-ox,vy=a.y-oy,vz=a.z-oz,kd=kx*vx+kz*vz;a.x=ox+vx*co+(-kz*vy)*si+kx*kd*(1-co);a.y=oy+vy*co+(kz*vx-kx*vz)*si;a.z=oz+vz*co+(kx*vy)*si+kz*kd*(1-co)})}}}} var sc={prop:'elem',map:{'C':'#2D2D2D','N':'#3050F8','O':'#FF2010','S':'#FFBF00','H':'#FFFFFF'}}; var bbSc={prop:'elem',map:{'C':'#CCCCCC','N':'#B0B8E8','O':'#EEAAAA','S':'#EEE0AA','H':'#EEEEEE'}}; viewer.setStyle({},{stick:{radius:0.12,colorscheme:sc},sphere:{scale:0.25,colorscheme:sc}}); var bbList=Array.from(bb); viewer.setStyle({index:bbList},{stick:{radius:0.12,colorscheme:bbSc},sphere:{scale:0.25,colorscheme:bbSc}});" %}
</div>
</div>
<div class="aa-card-body">
Isoleucine is one of only two amino acids (with threonine) that has two chiral centers. An isomer of leucine with the same molecular formula but a different branching pattern, only the (2S,3S) form is incorporated into proteins. Distinguishing isoleucine from valine is one of the classic challenges for the aminoacyl-tRNA synthetases, since the two differ by just a single methyl group.
</div>
</div>

#### Leucine

<div class="aa-card">
<div class="aa-card-header">
<div class="aa-card-structure">
<img src="{{ 'assets/img/amino-acids/leu.svg' | relative_url }}" alt="Leucine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Leu | L | MW: 131.17 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>4</td></tr>
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
<img src="{{ 'assets/img/amino-acids/met.svg' | relative_url }}" alt="Methionine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Met | M | MW: 149.21 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>4</td></tr>
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
<img src="{{ 'assets/img/amino-acids/phe.svg' | relative_url }}" alt="Phenylalanine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Phe | F | MW: 165.19 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>7</td></tr>
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
<img src="{{ 'assets/img/amino-acids/tyr.svg' | relative_url }}" alt="Tyrosine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Tyr | Y | MW: 181.19 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>8</td></tr>
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
<img src="{{ 'assets/img/amino-acids/trp.svg' | relative_url }}" alt="Tryptophan structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Trp | W | MW: 204.23 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>10</td></tr>
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
<img src="{{ 'assets/img/amino-acids/arg.svg' | relative_url }}" alt="Arginine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Arg | R | MW: 174.20 Da</div>
<table>
<tr><td>Charge</td><td>+1</td></tr>
<tr><td>R-group atoms</td><td>7</td></tr>
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
<img src="{{ 'assets/img/amino-acids/his.svg' | relative_url }}" alt="Histidine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">His | H | MW: 155.16 Da</div>
<table>
<tr><td>Charge</td><td>~0 (pKa ~6.0)</td></tr>
<tr><td>R-group atoms</td><td>5</td></tr>
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
<img src="{{ 'assets/img/amino-acids/lys.svg' | relative_url }}" alt="Lysine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Lys | K | MW: 146.19 Da</div>
<table>
<tr><td>Charge</td><td>+1</td></tr>
<tr><td>R-group atoms</td><td>5</td></tr>
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
<img src="{{ 'assets/img/amino-acids/asp.svg' | relative_url }}" alt="Aspartate structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Asp | D | MW: 133.10 Da</div>
<table>
<tr><td>Charge</td><td>-1</td></tr>
<tr><td>R-group atoms</td><td>3</td></tr>
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
<img src="{{ 'assets/img/amino-acids/glu.svg' | relative_url }}" alt="Glutamate structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Glu | E | MW: 147.13 Da</div>
<table>
<tr><td>Charge</td><td>-1</td></tr>
<tr><td>R-group atoms</td><td>4</td></tr>
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
<img src="{{ 'assets/img/amino-acids/ser.svg' | relative_url }}" alt="Serine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Ser | S | MW: 105.09 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>2</td></tr>
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
<img src="{{ 'assets/img/amino-acids/thr.svg' | relative_url }}" alt="Threonine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Thr | T | MW: 119.12 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>3</td></tr>
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
<img src="{{ 'assets/img/amino-acids/asn.svg' | relative_url }}" alt="Asparagine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Asn | N | MW: 132.12 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>4</td></tr>
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
<img src="{{ 'assets/img/amino-acids/gln.svg' | relative_url }}" alt="Glutamine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Gln | Q | MW: 146.15 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>5</td></tr>
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
<img src="{{ 'assets/img/amino-acids/cys.svg' | relative_url }}" alt="Cysteine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Cys | C | MW: 121.16 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>2</td></tr>
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
<img src="{{ 'assets/img/amino-acids/gly.svg' | relative_url }}" alt="Glycine structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Gly | G | MW: 75.03 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>0</td></tr>
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
<img src="{{ 'assets/img/amino-acids/pro.svg' | relative_url }}" alt="Proline structure">
</div>
<div class="aa-card-stats">
<div class="aa-codes">Pro | P | MW: 115.13 Da</div>
<table>
<tr><td>Charge</td><td>Neutral</td></tr>
<tr><td>R-group atoms</td><td>3</td></tr>
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

## The 21st Amino Acid

TODO

## Substitution Matrices

TODO

## The Genetic Code

TODO

---

<div class="footnotes" markdown="1">
<small>
<p id="fn-ala-not-gly"><a href="#fnref-ala-not-gly">*</a> Why alanine and not glycine, the simplest amino acid? Glycine's lack of any side chain gives it unusual backbone flexibility, so substituting glycine would change the protein's conformational dynamics, not just remove the side chain's chemistry. Alanine's methyl group constrains the backbone like a normal amino acid while contributing almost nothing chemically.</p>
</small>
</div>
