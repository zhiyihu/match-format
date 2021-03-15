function countWordNum() {
	var text = $("match-content").value;
	$("match-word-num").innerText = text.length;
	$("en-char-num").innerText = FormatUtil.getEnChCount(text);
}

function $(id) {
	return document.getElementById(id);
}

var replaceChineseNum = function(e){
	var inputTextarea = $("match-content");
	var reg = new RegExp(e.getAttribute('data-num'), 'g');
	var text = inputTextarea.value;
	inputTextarea.value = text.replace(reg, e.innerText);
}


window.onload = function() {
	var inputTextarea = $("match-content");

	var statusSpan = $("status-text");
	var formatBtn = $("format-btn");
	var resetBtn = $("reset-btn");
	var cutBtn = $("cut-btn");
	var cutSel = $("cut-select");
	var repBtn = $("replace-btn");

	var orgIpt = $("original-ipt");
	var repIpt = $("rep-ipt");
	var repNumBtn = $("replace-num-btn");
	var repDiv = $("rep-div");

	var autoRepDiv = $("auto-rep-div");

	var singleWordTypeIndex = 0;
	var singleWordNumIndex = 0;

	resetBtn.onclick = function() {
		location.reload();
	}

	formatBtn.onclick = function() {
		var text = inputTextarea.value;
		var fmtStr = FormatUtil.getFormatStr(text);
		inputTextarea.value = fmtStr;
		statusSpan.innerHTML = FormatUtil.getStatusHTML(fmtStr);
		countWordNum();
		$("gbk-num").innerText = FormatUtil.getOUT3500(fmtStr);
	}
	
	cutBtn.onclick = function(){
		var cutNum = cutSel.value - 0;
		var text = inputTextarea.value;
		var fmtStr = FormatUtil.getFormatStr(text);
		inputTextarea.value = FormatUtil.getCutStr(fmtStr, cutNum);
		statusSpan.innerHTML = FormatUtil.getStatusHTML(fmtStr);
		countWordNum();
		$("gbk-num").innerText = FormatUtil.getOUT3500(fmtStr);
	}

	repBtn.onclick = function(){
		if(!orgIpt.value){
			return;
		}
		var reg = new RegExp(orgIpt.value, 'g');
		var text = inputTextarea.value;
		inputTextarea.value = text.replace(reg, repIpt.value);
		orgIpt.value = '';
		repIpt.value = '';
	}

	repNumBtn.onclick = function(){
		var reg = new RegExp('[0-9]+', 'g');
		var text = inputTextarea.value;
		var numMatchRes = text.match(reg) || [];
		var resHtml = '';

		for(var r of numMatchRes){
			resHtml += `<div><span>${r}</span>`;
			resHtml += `<a href="javascript:;" onclick="replaceChineseNum(this);" data-num="${r}">${FormatUtil.exchangeNum(r)}</a>`;
			resHtml += `<a href="javascript:;" onclick="replaceChineseNum(this);" data-num="${r}">${FormatUtil.exchangeNum(r, 1)}</a></div>`;
		}
		repDiv.innerHTML = resHtml;
	}


	var alinks = autoRepDiv.children;
	for(let i = 0; i < alinks.length; i++){
		let a = alinks[i];
		a.onclick = function(){
			orgIpt.value = this.getAttribute("data-rep");
			autoRepDiv.style.display = "none";
		}
	}

	orgIpt.onfocus = function(){
		autoRepDiv.style.display = "block";
	}


}

document.onkeydown = function(e) {
	if (e.ctrlKey && e.keyCode == 83) {
		e.returnValue = false;
		return;
	}
}
