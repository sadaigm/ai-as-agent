export const getNodes : any = (edges: any[], nodeId: string) => {

    if(nodeId.startsWith("startNode-")){
        return [];
    }
    const edge = edges.find((edge) => edge.target === nodeId);
    if (!edge) {
        return [];
    }
    else if(edge.source.startsWith("startNode-")){
        return [];
    }
    else{
      const nodes: any =  getNodes(edges, edge.source);
      console.log({nodes})
      return [edge.source, ...nodes];
    }
}