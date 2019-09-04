import { Component, OnInit, ViewChild } from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { ITreeState, ITreeOptions, TreeComponent, IActionMapping, TreeModel, TREE_ACTIONS, TreeNode } from 'angular-tree-component';
import { v4 } from 'uuid';
import * as $ from 'jquery';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ allowedMimeType: ["text/plain"], allowedFileType: ["text"] });
  public hasBaseDropZoneOver: boolean = false;
  public hasSelected:boolean = false;
  public selectedText: string;
  @ViewChild(TreeComponent, { static: false })
  private tree: TreeComponent;
  public state: ITreeState = {
    expandedNodeIds: {
      1: true
    },
    hiddenNodeIds: {},
    activeNodeIds: {}
  };
  public actions:IActionMapping ={
    mouse: { 
      checkboxClick: this.onSelect,
      click: (tree, node, ev)=>this.onClick(tree,node,ev,this.setText)
     },
  }
  public options: ITreeOptions = {
    allowDrag: (node) => node.isLeaf,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`
    }),
    useCheckbox: true,
    useTriState: false,
    actionMapping: this.actions
  };

  public nodes: INode[] = [
    {
      id: 1,
      name: 'Root',
      children: []
    }
  ];
  constructor() { 
  }

  public onDrop(files: File[]) {
    for(let i = 0; i < files.length; i++)
      this.nodes[0].children.push(this.fileToNode(files[i]));
    this.tree.treeModel.update();
  }

  private fileToNode(file: File){
    return {
      name: file.name,
      content: file
    } as INode;
  }

  private onSelect(model: TreeModel, node: TreeNode, $event) {
    TREE_ACTIONS.TOGGLE_SELECTED(model, node, $event);
  }

  ngOnInit() {
  }

  private onClick(tree:TreeModel, node:TreeNode, ev, callBack: (text)=>void){
    TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, ev);
    let selected:File = node.data.content;
    if(!selected || selected.type !== "text/plain") return;
    let reader = new FileReader();
    reader.onload = function($ev: ProgressEvent) {
      var text = reader.result as string;
      callBack(text);
      // return text as any;
      // console.log(reader.result.substring(0, 200));
    };
    reader.readAsText(selected);
  }
  private setText = (text) => {
    this.selectedText = text;
  }
  public zipItUp(){
    let selected = this.tree.treeModel.selectedLeafNodes;
    if(!selected.length) return;
    if(selected.some(s=>s.isRoot)){
      alert("Zip cannot contain root.");
      return;
    }
    let children = $.extend(true, [], selected.map(s => s.data));
    let zipped: INode = {
      children,
      name: "Zipped!",
      zipped: true
    }
    // this.removeIds(zipped);
    this.nodes[0].children.push(zipped);
    this.tree.treeModel.collapseAll();
    this.tree.treeModel.update();
  }
  public unZip(){
    let selected = this.tree.treeModel.selectedLeafNodes;
    if(selected.length != 1 || !selected[0].data.zipped) return;
    let current: INode;
    let root = selected[0].children;
    let index = 0;
    while(true){
      current = root[index++];
      if (!current) break;
      this.nodes[0].children.push(current.data);
    }
    this.tree.treeModel.update();
  }
  // private removeIds(node: INode) {
  //   if (!node) return;

  //   delete node.id;
  //   let children = node.children;
  //   if(!children) return;
  //   for (let i = 0; i < children.length; i++)
  //     this.removeIds(children[i]);
  // }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
}
interface INode{
  id?:number;
  name?:string;
  children?: INode[];
  content?: File;
  [index: string]: any;
}
