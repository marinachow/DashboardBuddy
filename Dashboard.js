class Dashboard {
    constructor(id, name, description, sections) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.sections = sections;
    }
    
    print() {
        console.log(`id: ${this.id}, name: ${this.name}, description: ${this.description}, sections: ${this.sections}`);
    }
}

module.exports = Dashboard;